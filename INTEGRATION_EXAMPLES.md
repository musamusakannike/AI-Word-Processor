# Integration Examples

This document shows how to integrate the AI Word Processor API into various applications and platforms.

## Table of Contents

1. [Python Integration](#python-integration)
2. [JavaScript/Node.js Integration](#javascriptnodejs-integration)
3. [React Frontend Integration](#react-frontend-integration)
4. [cURL Examples](#curl-examples)
5. [Postman Collection](#postman-collection)

---

## Python Integration

### Basic Usage

```python
import requests
import os

class WordProcessorClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def generate_document(self, prompt):
        """Generate a document from a prompt"""
        response = requests.post(
            f"{self.base_url}/generate",
            json={"prompt": prompt}
        )
        return response.json()
    
    def download_document(self, filename, save_path=None):
        """Download a generated document"""
        if save_path is None:
            save_path = filename
        
        response = requests.get(f"{self.base_url}/download/{filename}")
        
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        return False
    
    def cleanup_old_files(self, max_age_hours=24):
        """Clean up old generated files"""
        response = requests.delete(
            f"{self.base_url}/cleanup",
            params={"max_age_hours": max_age_hours}
        )
        return response.json()

# Usage example
client = WordProcessorClient()

# Generate a resume
result = client.generate_document("""
Create a professional resume with:
- Name: Jane Smith
- Email: jane@example.com
- Experience section with 2 jobs
- Education section
- Skills section
""")

if result["success"]:
    print(f"Document generated: {result['filename']}")
    
    # Download the file
    if client.download_document(result["filename"], "my_resume.docx"):
        print("Document downloaded successfully!")
else:
    print(f"Error: {result['error']}")
```

### Async Usage (with asyncio)

```python
import aiohttp
import asyncio

class AsyncWordProcessorClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    async def generate_document(self, prompt):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/generate",
                json={"prompt": prompt}
            ) as response:
                return await response.json()
    
    async def download_document(self, filename, save_path=None):
        if save_path is None:
            save_path = filename
        
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/download/{filename}"
            ) as response:
                if response.status == 200:
                    with open(save_path, 'wb') as f:
                        f.write(await response.read())
                    return True
                return False

# Usage
async def main():
    client = AsyncWordProcessorClient()
    
    # Generate multiple documents concurrently
    prompts = [
        "Create a business letter",
        "Create a meeting agenda",
        "Create an invoice template"
    ]
    
    tasks = [client.generate_document(p) for p in prompts]
    results = await asyncio.gather(*tasks)
    
    for result in results:
        if result["success"]:
            print(f"Generated: {result['filename']}")

asyncio.run(main())
```

---

## JavaScript/Node.js Integration

### Using Fetch API

```javascript
class WordProcessorClient {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }

    async generateDocument(prompt) {
        const response = await fetch(`${this.baseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });
        
        return await response.json();
    }

    async downloadDocument(filename) {
        const response = await fetch(`${this.baseUrl}/download/${filename}`);
        
        if (response.ok) {
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            return true;
        }
        return false;
    }

    async cleanupOldFiles(maxAgeHours = 24) {
        const response = await fetch(
            `${this.baseUrl}/cleanup?max_age_hours=${maxAgeHours}`,
            { method: 'DELETE' }
        );
        return await response.json();
    }
}

// Usage
const client = new WordProcessorClient();

async function createResume() {
    const result = await client.generateDocument(`
        Create a professional resume with:
        - Name: John Doe
        - Email: john@example.com
        - Work experience section
        - Education section
    `);

    if (result.success) {
        console.log('Document generated:', result.filename);
        await client.downloadDocument(result.filename);
    } else {
        console.error('Error:', result.error);
    }
}

createResume();
```

### Using Axios (Node.js)

```javascript
const axios = require('axios');
const fs = require('fs');

class WordProcessorClient {
    constructor(baseUrl = 'http://localhost:8000') {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async generateDocument(prompt) {
        try {
            const response = await this.client.post('/generate', { prompt });
            return response.data;
        } catch (error) {
            console.error('Error generating document:', error);
            throw error;
        }
    }

    async downloadDocument(filename, savePath = null) {
        try {
            const response = await this.client.get(`/download/${filename}`, {
                responseType: 'arraybuffer',
            });

            const path = savePath || filename;
            fs.writeFileSync(path, response.data);
            return true;
        } catch (error) {
            console.error('Error downloading document:', error);
            return false;
        }
    }
}

// Usage
const client = new WordProcessorClient();

async function main() {
    const result = await client.generateDocument(
        'Create a simple business letter template'
    );

    if (result.success) {
        console.log('Generated:', result.filename);
        await client.downloadDocument(result.filename, 'output.docx');
        console.log('Downloaded to output.docx');
    }
}

main();
```

---

## React Frontend Integration

### Custom Hook

```javascript
import { useState, useCallback } from 'react';

export function useWordProcessor(baseUrl = 'http://localhost:8000') {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateDocument = useCallback(async (prompt) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (data.success) {
                return data;
            } else {
                throw new Error(data.error || 'Failed to generate document');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [baseUrl]);

    const downloadDocument = useCallback(async (filename) => {
        try {
            const response = await fetch(`${baseUrl}/download/${filename}`);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [baseUrl]);

    return { generateDocument, downloadDocument, loading, error };
}
```

### React Component

```javascript
import React, { useState } from 'react';
import { useWordProcessor } from './useWordProcessor';

function DocumentGenerator() {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState(null);
    const { generateDocument, downloadDocument, loading, error } = useWordProcessor();

    const handleGenerate = async () => {
        try {
            const data = await generateDocument(prompt);
            setResult(data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDownload = async () => {
        if (result && result.filename) {
            await downloadDocument(result.filename);
        }
    };

    return (
        <div className="document-generator">
            <h1>AI Word Processor</h1>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the document you want to create..."
                rows={10}
                cols={50}
            />
            
            <button onClick={handleGenerate} disabled={loading || !prompt}>
                {loading ? 'Generating...' : 'Generate Document'}
            </button>

            {error && <div className="error">Error: {error}</div>}

            {result && result.success && (
                <div className="result">
                    <h2>Document Generated!</h2>
                    <p>Filename: {result.filename}</p>
                    <button onClick={handleDownload}>Download</button>
                    
                    <details>
                        <summary>View Generated Code</summary>
                        <pre>{result.generated_code}</pre>
                    </details>
                </div>
            )}
        </div>
    );
}

export default DocumentGenerator;
```

---

## cURL Examples

### Generate a Document

```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a professional resume with name, email, experience, and education sections"
  }'
```

### Download a Document

```bash
curl -O "http://localhost:8000/download/document_123e4567-e89b-12d3-a456-426614174000.docx"
```

### Cleanup Old Files

```bash
curl -X DELETE "http://localhost:8000/cleanup?max_age_hours=24"
```

### Get API Info

```bash
curl "http://localhost:8000/"
```

---

## Postman Collection

### Collection JSON

```json
{
  "info": {
    "name": "AI Word Processor API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate Document",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"prompt\": \"Create a professional resume with sections for education, experience, and skills\"\n}"
        },
        "url": {
          "raw": "http://localhost:8000/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["generate"]
        }
      }
    },
    {
      "name": "Download Document",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8000/download/{{filename}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["download", "{{filename}}"]
        }
      }
    },
    {
      "name": "Cleanup Old Files",
      "request": {
        "method": "DELETE",
        "url": {
          "raw": "http://localhost:8000/cleanup?max_age_hours=24",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["cleanup"],
          "query": [
            {
              "key": "max_age_hours",
              "value": "24"
            }
          ]
        }
      }
    },
    {
      "name": "API Info",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:8000/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": [""]
        }
      }
    }
  ]
}
```

---

## Error Handling Best Practices

### Python

```python
def safe_generate_document(prompt, max_retries=3):
    client = WordProcessorClient()
    
    for attempt in range(max_retries):
        try:
            result = client.generate_document(prompt)
            
            if result["success"]:
                return result
            else:
                print(f"Attempt {attempt + 1} failed: {result.get('error')}")
                
        except requests.exceptions.RequestException as e:
            print(f"Network error on attempt {attempt + 1}: {e}")
            
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)  # Exponential backoff
    
    raise Exception("Failed to generate document after maximum retries")
```

### JavaScript

```javascript
async function safeGenerateDocument(prompt, maxRetries = 3) {
    const client = new WordProcessorClient();
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const result = await client.generateDocument(prompt);
            
            if (result.success) {
                return result;
            } else {
                console.log(`Attempt ${attempt + 1} failed:`, result.error);
            }
        } catch (error) {
            console.error(`Network error on attempt ${attempt + 1}:`, error);
        }
        
        if (attempt < maxRetries - 1) {
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
        }
    }
    
    throw new Error('Failed to generate document after maximum retries');
}
```

---

## Environment-Specific Configuration

### Development

```javascript
const config = {
    development: {
        apiUrl: 'http://localhost:8000',
        timeout: 30000,
    },
    production: {
        apiUrl: 'https://api.yourapp.com',
        timeout: 60000,
    },
};

const env = process.env.NODE_ENV || 'development';
const client = new WordProcessorClient(config[env].apiUrl);
```

### Python

```python
import os

class Config:
    DEVELOPMENT = {
        'api_url': 'http://localhost:8000',
        'timeout': 30,
    }
    PRODUCTION = {
        'api_url': 'https://api.yourapp.com',
        'timeout': 60,
    }

env = os.getenv('ENVIRONMENT', 'DEVELOPMENT')
config = getattr(Config, env)
client = WordProcessorClient(config['api_url'])
```

---

## Testing Integration

### Python Unit Tests

```python
import unittest
from unittest.mock import patch, Mock

class TestWordProcessorClient(unittest.TestCase):
    def setUp(self):
        self.client = WordProcessorClient()
    
    @patch('requests.post')
    def test_generate_document_success(self, mock_post):
        mock_response = Mock()
        mock_response.json.return_value = {
            'success': True,
            'filename': 'test.docx',
            'download_url': '/download/test.docx'
        }
        mock_post.return_value = mock_response
        
        result = self.client.generate_document('Create a test document')
        
        self.assertTrue(result['success'])
        self.assertEqual(result['filename'], 'test.docx')

if __name__ == '__main__':
    unittest.main()
```

---

## Rate Limiting Example

```python
import time
from functools import wraps

class RateLimiter:
    def __init__(self, max_calls, period):
        self.max_calls = max_calls
        self.period = period
        self.calls = []
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            self.calls = [c for c in self.calls if c > now - self.period]
            
            if len(self.calls) >= self.max_calls:
                sleep_time = self.period - (now - self.calls[0])
                time.sleep(sleep_time)
            
            self.calls.append(time.time())
            return func(*args, **kwargs)
        
        return wrapper

# Usage: Max 10 calls per minute
@RateLimiter(max_calls=10, period=60)
def generate_document(prompt):
    client = WordProcessorClient()
    return client.generate_document(prompt)
```

---

**Note**: All examples assume the server is running on `http://localhost:8000`. Adjust the URL as needed for your deployment.
