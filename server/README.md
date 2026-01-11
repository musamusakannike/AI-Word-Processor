# AI Word Processor API

A FastAPI server that uses Google's Gemini API to generate Python code for creating DOCX files based on user prompts.

## Features

- 🤖 **AI-Powered Document Generation**: Uses Gemini 1.5 Flash to generate Python code
- 📄 **DOCX Creation**: Automatically creates Word documents using python-docx
- 🔗 **Download Links**: Returns download URLs for generated documents
- 🧹 **Auto Cleanup**: Endpoint to clean up old generated files
- 🚀 **Fast & Efficient**: Built with FastAPI for high performance

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```.env
GEMINI_API_KEY=your_actual_api_key_here
```

To get a Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env` file

### 3. Run the Server

```bash
# Development mode
uvicorn main:app --reload

# Production mode
python main.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### 1. Generate Document

**POST** `/generate`

Generate a DOCX document from a text prompt.

**Request Body:**

```json
{
  "prompt": "Create a professional resume with sections for education, experience, and skills"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Document generated successfully",
  "download_url": "/download/document_123e4567-e89b-12d3-a456-426614174000.docx",
  "filename": "document_123e4567-e89b-12d3-a456-426614174000.docx",
  "generated_code": "from docx import Document\n..."
}
```

### 2. Download Document

**GET** `/download/{filename}`

Download a generated DOCX file.

**Example:**

```bash
GET /download/document_123e4567-e89b-12d3-a456-426614174000.docx
```

### 3. Cleanup Old Files

**DELETE** `/cleanup?max_age_hours=24`

Remove generated files older than specified hours.

**Response:**

```json
{
  "message": "Cleaned up 5 old files",
  "deleted_count": 5
}
```

## Usage Examples

### Using cURL

```bash
# Generate a document
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a business letter template with company header, date, recipient address, salutation, body paragraphs, and signature"}'

# Download the document
curl -O "http://localhost:8000/download/document_xxxxx.docx"
```

### Using Python

```python
import requests

# Generate document
response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "Create a meeting agenda with sections for attendees, topics, and action items"
    }
)

data = response.json()
if data["success"]:
    # Download the file
    download_url = f"http://localhost:8000{data['download_url']}"
    file_response = requests.get(download_url)
    
    with open(data["filename"], "wb") as f:
        f.write(file_response.content)
    
    print(f"Document saved as {data['filename']}")
```

### Using JavaScript/Fetch

```javascript
// Generate document
const response = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a project proposal with executive summary, objectives, timeline, and budget'
  })
});

const data = await response.json();

if (data.success) {
  // Download the file
  const downloadUrl = `http://localhost:8000${data.download_url}`;
  window.open(downloadUrl, '_blank');
}
```

## Example Prompts

Here are some example prompts you can use:

1. **Resume**: "Create a professional resume with sections for contact information, summary, work experience, education, and skills. Use proper formatting with bold headings."

2. **Business Letter**: "Create a formal business letter with company letterhead, date, recipient address, subject line, professional greeting, 3 body paragraphs, and closing signature."

3. **Report**: "Create a technical report with title page, table of contents, executive summary, introduction, methodology, results, conclusion, and references sections."

4. **Invoice**: "Create an invoice template with company details, invoice number, date, client information, itemized services table with quantities and prices, subtotal, tax, and total."

5. **Meeting Minutes**: "Create meeting minutes document with meeting title, date, attendees list, agenda items, discussion points, decisions made, and action items with owners."

## Project Structure

```
AI Word Processor/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .env                   # Your API keys (not in git)
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── generated_files/      # Generated DOCX files (auto-created)
```

## How It Works

1. **User sends a prompt** describing the desired document
2. **Gemini API generates Python code** using python-docx library
3. **Server executes the code** to create the DOCX file
4. **File is saved** in the `generated_files/` directory
5. **Download URL is returned** to the user
6. **User downloads** the generated document

## Error Handling

The API includes comprehensive error handling:

- Invalid prompts return error messages
- Code execution errors are caught and reported
- Missing files return 404 errors
- All errors include detailed messages for debugging

## Security Considerations

- The server executes generated code in a controlled environment
- Generated files are stored in a dedicated directory
- Old files can be cleaned up automatically
- API key is stored in environment variables

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
