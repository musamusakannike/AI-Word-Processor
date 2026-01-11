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

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="AI Word Processor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create directories for storing generated files
GENERATED_DIR = Path("generated_files")
GENERATED_DIR.mkdir(exist_ok=True)

# Mount the generated files directory for serving files
app.mount("/files", StaticFiles(directory=str(GENERATED_DIR)), name="files")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction="""You are a coding engine specialized in generating Python code using python-docx library.
You must output ONLY valid Python code that creates a DOCX document based on the user's requirements.
Do not provide any explanations, comments, or introductory text.
Do not format with Markdown backticks.

The code must:
1. Import necessary modules from docx (Document, Inches, Pt, RGBColor, etc.)
2. Create a Document object
3. Add content based on the user's prompt (headings, paragraphs, tables, images, etc.)
4. Save the document to the provided file path
5. Use the variable 'output_path' for the file path (this will be provided)

Example structure:
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()
# Add content based on user requirements
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
        gemini_prompt = f"""Generate Python code using python-docx to create a document with the following requirements:

{request.prompt}

Remember to use 'output_path' as the variable for the file path."""
        
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
        raise HTTPException(status_code=404, detail="File not found")
    
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
