"""
Test client for the AI Word Processor API
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"


def test_generate_document(prompt: str):
    """Test document generation endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing with prompt: {prompt[:100]}...")
    print(f"{'='*60}\n")
    
    try:
        # Send request
        response = requests.post(
            f"{BASE_URL}/generate",
            json={"prompt": prompt},
            timeout=30
        )
        
        data = response.json()
        
        # Print response
        print("Response:")
        print(json.dumps(data, indent=2))
        
        if data.get("success"):
            print(f"\n✅ Success! Document generated: {data['filename']}")
            print(f"📥 Download URL: {BASE_URL}{data['download_url']}")
            
            # Download the file
            download_url = f"{BASE_URL}{data['download_url']}"
            download_response = requests.get(download_url)
            
            if download_response.status_code == 200:
                output_filename = f"test_{data['filename']}"
                with open(output_filename, "wb") as f:
                    f.write(download_response.content)
                print(f"💾 File saved as: {output_filename}")
            else:
                print(f"❌ Failed to download file: {download_response.status_code}")
        else:
            print(f"\n❌ Failed: {data.get('message')}")
            if data.get('error'):
                print(f"Error: {data['error']}")
            
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None


def test_api_root():
    """Test root endpoint"""
    print("\n" + "="*60)
    print("Testing API Root Endpoint")
    print("="*60 + "\n")
    
    try:
        response = requests.get(BASE_URL)
        data = response.json()
        print("API Info:")
        print(json.dumps(data, indent=2))
        print("\n✅ API is running!")
    except requests.exceptions.RequestException as e:
        print(f"❌ API is not accessible: {e}")
        print("Make sure the server is running with: uvicorn main:app --reload")


if __name__ == "__main__":
    # Test API root
    test_api_root()
    
    # Wait a bit
    time.sleep(1)
    
    # Test document generation with different prompts
    prompts = [
        """Create a professional resume with the following sections:
        - Header with name "John Doe" and contact information
        - Professional Summary
        - Work Experience with 2 job entries
        - Education section
        - Skills section with bullet points
        Use proper formatting with bold headings and consistent spacing.""",
        
        """Create a simple business letter with:
        - Company letterhead "ABC Corporation"
        - Date
        - Recipient address
        - Subject: "Project Proposal"
        - 3 paragraphs of body text
        - Professional closing with signature line""",
        
        """Create a meeting agenda document with:
        - Title: "Quarterly Review Meeting"
        - Date and time
        - List of attendees
        - 5 agenda items with time allocations
        - Notes section at the bottom"""
    ]
    
    # Test with the first prompt
    test_generate_document(prompts[0])
    
    # Uncomment to test with more prompts
    # for prompt in prompts[1:]:
    #     time.sleep(2)
    #     test_generate_document(prompt)
