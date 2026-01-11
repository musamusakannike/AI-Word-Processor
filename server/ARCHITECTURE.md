# System Architecture

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
│                                                                  │
│  POST /generate                                                  │
│  {                                                               │
│    "prompt": "Create a professional resume..."                  │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI SERVER                              │
│                                                                  │
│  1. Receive prompt                                               │
│  2. Generate unique filename (UUID)                              │
│  3. Prepare Gemini prompt                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GEMINI API                                  │
│                   (gemini-1.5-flash)                             │
│                                                                  │
│  System Instruction:                                             │
│  "You are a coding engine. Output ONLY valid Python code         │
│   using python-docx library..."                                  │
│                                                                  │
│  User Prompt:                                                    │
│  "Generate Python code to create a document with..."             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GENERATED PYTHON CODE                          │
│                                                                  │
│  from docx import Document                                       │
│  from docx.shared import Inches, Pt                              │
│                                                                  │
│  doc = Document()                                                │
│  doc.add_heading('Resume', 0)                                    │
│  doc.add_paragraph('John Doe')                                   │
│  # ... more code ...                                             │
│  doc.save(output_path)                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CODE EXECUTION                                │
│                                                                  │
│  exec(generated_code, {                                          │
│    "output_path": "generated_files/document_uuid.docx"           │
│  })                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DOCX FILE CREATED                              │
│                                                                  │
│  📄 generated_files/document_123e4567.docx                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JSON RESPONSE                                 │
│                                                                  │
│  {                                                               │
│    "success": true,                                              │
│    "message": "Document generated successfully",                 │
│    "download_url": "/download/document_123e4567.docx",           │
│    "filename": "document_123e4567.docx",                         │
│    "generated_code": "from docx import Document\n..."            │
│  }                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER DOWNLOADS FILE                           │
│                                                                  │
│  GET /download/document_123e4567.docx                            │
│                                                                  │
│  📥 Download starts...                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. FastAPI Server (`main.py`)

- **Port**: 8000 (default)
- **Framework**: FastAPI with Uvicorn
- **Endpoints**:
  - `POST /generate` - Generate documents
  - `GET /download/{filename}` - Download files
  - `DELETE /cleanup` - Clean old files
  - `GET /` - API info

### 2. Gemini Integration

- **Model**: gemini-1.5-flash
- **Purpose**: Generate Python code from natural language
- **System Instruction**: Ensures code-only output
- **API Key**: Loaded from `.env` file

### 3. Code Execution

- **Method**: Python's `exec()` function
- **Environment**: Controlled globals with `output_path`
- **Safety**: Isolated execution context

### 4. File Management

- **Storage**: `generated_files/` directory
- **Naming**: UUID-based unique filenames
- **Format**: DOCX (Microsoft Word)
- **Cleanup**: Optional endpoint to remove old files

### 5. Response Format

- **Success**: Returns download URL and metadata
- **Failure**: Returns error message and generated code
- **Code Included**: For debugging purposes

## Technology Stack

```
┌─────────────────────────────────────────┐
│           Frontend/Client               │
│  (cURL, Python requests, JavaScript)    │
└──────────────┬──────────────────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────────────────┐
│          FastAPI Server                 │
│  - Request handling                     │
│  - Validation (Pydantic)                │
│  - File serving                         │
└──────────────┬──────────────────────────┘
               │ API Call
               ▼
┌─────────────────────────────────────────┐
│         Google Gemini API               │
│  - Natural language processing          │
│  - Code generation                      │
└──────────────┬──────────────────────────┘
               │ Python Code
               ▼
┌─────────────────────────────────────────┐
│         python-docx Library             │
│  - Document creation                    │
│  - Formatting                           │
│  - DOCX generation                      │
└──────────────┬──────────────────────────┘
               │ File
               ▼
┌─────────────────────────────────────────┐
│         File System                     │
│  - generated_files/ directory           │
│  - UUID-named DOCX files                │
└─────────────────────────────────────────┘
```

## Security Considerations

1. **API Key Protection**
   - Stored in `.env` file
   - Gitignored
   - Never exposed in responses

2. **Code Execution**
   - Controlled environment
   - Limited globals
   - Error handling

3. **File Access**
   - Dedicated directory
   - UUID filenames prevent guessing
   - Optional cleanup endpoint

4. **Input Validation**
   - Pydantic models
   - Type checking
   - Error handling

## Scalability Considerations

For production use, consider:

1. **Rate Limiting**: Prevent API abuse
2. **Authentication**: Secure endpoints
3. **Queue System**: Handle concurrent requests
4. **Storage**: Cloud storage for files
5. **Monitoring**: Log requests and errors
6. **Caching**: Cache common document types
7. **Load Balancing**: Multiple server instances

## Error Handling Flow

```
Request → Validation → Gemini API → Code Execution → File Creation
   ↓          ↓            ↓              ↓              ↓
 Error     Error        Error          Error          Error
   ↓          ↓            ↓              ↓              ↓
   └──────────┴────────────┴──────────────┴──────────────┘
                           │
                           ▼
                    Error Response
                    {
                      "success": false,
                      "message": "...",
                      "error": "...",
                      "generated_code": "..."
                    }
```

## Performance Metrics

Typical request flow:

- **Request validation**: < 1ms
- **Gemini API call**: 1-3 seconds
- **Code execution**: < 1 second
- **File creation**: < 500ms
- **Total**: 2-5 seconds per document

## Future Enhancements

Potential improvements:

- [ ] Multiple document formats (PDF, TXT, HTML)
- [ ] Template library
- [ ] Batch processing
- [ ] Document preview
- [ ] Version control for documents
- [ ] User accounts and history
- [ ] Custom styling options
- [ ] Image upload support
- [ ] Collaborative editing
- [ ] API rate limiting
