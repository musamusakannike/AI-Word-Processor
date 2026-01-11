# Quick Reference Guide

## 🚀 Starting the Server

```bash
# Option 1: Using uvicorn (recommended for development)
uvicorn main:app --reload

# Option 2: Using Python directly
python main.py

# Option 3: Custom host and port
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

## 📡 API Endpoints

### 1. Root Endpoint

```bash
GET http://localhost:8000/
```

### 2. Generate Document

```bash
POST http://localhost:8000/generate
Content-Type: application/json

{
  "prompt": "Your document description here"
}
```

### 3. Download Document

```bash
GET http://localhost:8000/download/{filename}
```

### 4. Cleanup Old Files

```bash
DELETE http://localhost:8000/cleanup?max_age_hours=24
```

## 🧪 Testing

### Using the Test Client

```bash
python test_client.py
```

### Using cURL

```bash
# Generate a document
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple letter with greeting and closing"}'

# Download a file
curl -O "http://localhost:8000/download/document_xxxxx.docx"
```

### Using Python Requests

```python
import requests

response = requests.post(
    "http://localhost:8000/generate",
    json={"prompt": "Create a resume template"}
)

data = response.json()
print(data)
```

## 📝 Prompt Tips

### Good Prompts Include

- **Specific structure**: List sections and their content
- **Formatting details**: Bold, italics, alignment
- **Content examples**: Sample text or data
- **Style preferences**: Professional, casual, formal

### Example Good Prompt

```
Create a professional invoice with:
- Company header: "ABC Corp" with logo placeholder
- Invoice number and date
- Bill to section with client details
- Table with 5 items (description, quantity, price, total)
- Subtotal, tax (10%), and grand total
- Payment terms at the bottom
Use bold for headings and align prices to the right.
```

### Example Bad Prompt

```
Make an invoice
```

## 🎨 Document Types You Can Generate

- ✅ Resumes and CVs
- ✅ Business letters
- ✅ Invoices and receipts
- ✅ Meeting agendas and minutes
- ✅ Reports (technical, business, academic)
- ✅ Proposals and contracts
- ✅ Certificates and awards
- ✅ Forms and templates
- ✅ Tables and lists
- ✅ Newsletters

## 🔧 Troubleshooting

### Server won't start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Use a different port
uvicorn main:app --port 8080
```

### API Key Error

```bash
# Make sure .env file exists
ls -la .env

# Check if GEMINI_API_KEY is set
cat .env
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Document Generation Fails

- Check the generated code in the response
- Ensure your prompt is clear and specific
- Try simplifying the prompt
- Check server logs for errors

## 📚 python-docx Capabilities

The generated code can use these features:

- Headings (levels 1-9)
- Paragraphs with formatting
- Bold, italic, underline text
- Font sizes and colors
- Tables with styling
- Bullet and numbered lists
- Page breaks
- Images (if file paths provided)
- Headers and footers
- Custom styles

## 🔐 Security Notes

- Never commit `.env` file to git
- Keep your API key secret
- The server executes generated code - use in trusted environments
- Consider rate limiting for production use
- Implement authentication for public deployments

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Document generated successfully",
  "download_url": "/download/document_xxxxx.docx",
  "filename": "document_xxxxx.docx",
  "generated_code": "from docx import Document\n..."
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to generate document",
  "error": "Error description",
  "generated_code": "from docx import Document\n..."
}
```

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Set up `.env` with your API key
3. ✅ Start the server
4. ✅ Test with `test_client.py`
5. ✅ Try different prompts
6. ✅ Integrate into your application

## 📞 Need Help?

- Check the README.md for detailed documentation
- Review examples.py for sample prompts
- Examine test_client.py for usage examples
- Check server logs for error messages
