# ⚠️ IMPORTANT: Set Up Your Gemini API Key

Before running the server, you need to add your Gemini API key to the `.env` file.

## Steps

1. **Get a Gemini API Key**
   - Visit: <https://makersuite.google.com/app/apikey>
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add the Key to .env**
   - Open the `.env` file in this directory
   - Replace `your_gemini_api_key_here` with your actual API key
   - Save the file

   Example:

   ```
   GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Verify the Setup**
   - Make sure the `.env` file is in the same directory as `main.py`
   - The key should be on a single line
   - No quotes needed around the key

## Then Start the Server

Once your API key is configured, start the server:

```bash
uvicorn main:app --reload
```

Or:

```bash
python main.py
```

## Test It

```bash
python test_client.py
```

---

**Note**: The `.env` file is gitignored for security. Never commit your API key to version control!
