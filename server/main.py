from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import uuid
from pathlib import Path
import traceback
from datetime import datetime
from dotenv import load_dotenv
import asyncio
from contextlib import asynccontextmanager

# Load environment variables from .env file
load_dotenv()

# Create directories for storing generated files
GENERATED_DIR = Path("generated_files")
GENERATED_DIR.mkdir(exist_ok=True)

async def periodic_cleanup():
    print("Cleanup task started")
    while True:
        await asyncio.sleep(60)  # Check every minute, wait before first check
        try:
            current_time = datetime.now().timestamp()
            max_age_seconds = 600  # 10 minutes (10 * 60)
            
            for file_path in GENERATED_DIR.glob("*.docx"):
                try:
                    if not file_path.exists():
                        continue
                        
                    stats = file_path.stat()
                    file_age = current_time - stats.st_mtime
                    
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        print(f"Deleted old file: {file_path.name}")
                except OSError as e:
                    print(f"Error accessing/deleting file {file_path}: {e}")
                except Exception as e:
                    print(f"Unexpected error with file {file_path}: {e}")
                    
        except Exception as e:
            print(f"Error in cleanup loop: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the background task
    cleanup_task = asyncio.create_task(periodic_cleanup())
    yield
    # Shutdown: Cancel the background task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass

app = FastAPI(title="AI Word Processor API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Mount the generated files directory for serving files
app.mount("/files", StaticFiles(directory=str(GENERATED_DIR)), name="files")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    system_instruction="""You are an expert document automation engineer specializing in `python-docx`.
Your goal is to generate Python code that creates highly professional, visually appealing, and comprehensive DOCX documents.

RULES:
1. **Output ONLY executable Python code**. No markdown backticks, no explanations, no comments.
2. **Professional Styling**:
   - Use a clean, modern font (e.g., Arial, Calibri, or Open Sans) if possible, or stick to standard professional fonts.
   - Use appropriate font sizes: 14pt-16pt for headings, 11pt-12pt for body text.
   - Add proper spacing between paragraphs (e.g., `paragraph_format.space_after = Pt(12)`).
   - Use bold and italics for emphasis where appropriate.
3. **Structure & Length**:
   - The document must be **EXTENSIVE** and **DETAILED**. Expand significantly on the user's prompt.
   - Use a clear hierarchy: Title -> Heading 1 -> Heading 2 -> Body Text.
   - Include clear sections (e.g., Introduction, Detailed Analysis, Key Findings, Conclusion).
   - Incorporate lists (bullet points and numbered lists) to break up text.
   - Use tables for structured data if relevant.
4. **Execution**:
   - The code must be complete and error-free.
   - Use the variable `output_path` for saving the file.
   - Imports must include all necessary classes from `docx`, `docx.shared`, `docx.enum.text`.

Example of expected code structure:
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# styles
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)

# Title
title = doc.add_heading('Professional Report', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Section
doc.add_heading('1. Introduction', level=1)
p = doc.add_paragraph('This is a detailed introduction...')
p.paragraph_format.space_after = Pt(12)

# Save
doc.save(output_path)
"""
)


class DocumentRequest(BaseModel):
    prompt: str


class DocumentResponse(BaseModel):
    success: bool
    message: str
    download_url: str | None = None
    filename: str | None = None
    generated_code: str | None = None
    error: str | None = None


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Word Processor API",
        "version": "1.0.0",
        "endpoints": {
            "POST /generate": "Generate a DOCX file from a prompt",
            "GET /download/{filename}": "Download a generated file"
        }
    }


@app.post("/generate", response_model=DocumentResponse)
async def generate_document(request: DocumentRequest):
    """
    Generate a DOCX document based on the user's prompt.
    
    Args:
        request: DocumentRequest containing the prompt
        
    Returns:
        DocumentResponse with download URL and metadata
    """
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"document_{file_id}.docx"
        output_path = GENERATED_DIR / filename
        
        # Create prompt for Gemini
        gemini_prompt = f"""Generate Python code using python-docx to create a DETAILED, LONG, and PROFESSIONALLY FORMATTED document based on the following requirements:

{request.prompt}

Requirements:
- Make the content extensive and ellaborate.
- Use professional formatting (headings, spacing, fonts).
- Ensure the code handles the saving to 'output_path'.
"""
        
        # Generate code using Gemini
        response = model.generate_content(gemini_prompt)
        generated_code = response.text.strip()
        
        # Prepare execution environment
        exec_globals = {
            "output_path": str(output_path),
            "__builtins__": __builtins__
        }
        
        # Execute the generated code
        exec(generated_code, exec_globals)
        
        # Verify the file was created
        if not output_path.exists():
            raise Exception("Document file was not created")
        
        # Generate download URL
        download_url = f"/download/{filename}"
        
        return DocumentResponse(
            success=True,
            message="Document generated successfully",
            download_url=download_url,
            filename=filename,
            generated_code=generated_code
        )
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error generating document: {error_trace}")
        
        return DocumentResponse(
            success=False,
            message="Failed to generate document",
            error=str(e),
            generated_code=generated_code if 'generated_code' in locals() else None
        )


@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a generated DOCX file.
    
    Args:
        filename: Name of the file to download
        
    Returns:
        FileResponse with the DOCX file
    """
    file_path = GENERATED_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=404, 
            detail="This document has been deleted as it exceeded the 10-minute retention period. Please generate a new document."
        )
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@app.delete("/cleanup")
async def cleanup_old_files(max_age_hours: int = 24):
    """
    Clean up old generated files.
    
    Args:
        max_age_hours: Maximum age of files to keep (default: 24 hours)
        
    Returns:
        Number of files deleted
    """
    deleted_count = 0
    current_time = datetime.now().timestamp()
    max_age_seconds = max_age_hours * 3600
    
    for file_path in GENERATED_DIR.glob("*.docx"):
        file_age = current_time - file_path.stat().st_mtime
        if file_age > max_age_seconds:
            file_path.unlink()
            deleted_count += 1
    
    return {
        "message": f"Cleaned up {deleted_count} old files",
        "deleted_count": deleted_count
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
