# AI Word Processor

AI Word Processor is a full-stack app that generates professional Microsoft Word (DOCX) documents from natural language prompts.

- Frontend: Next.js + React + Tailwind + Tiptap rich-text editor
- Backend: FastAPI service that uses Google Gemini to generate `python-docx` code, executes it, and returns a downloadable DOCX

## Repository Structure

- `frontend/` Next.js web app
- `server/` FastAPI API

## Prerequisites

- Node.js 18+ (or 20+)
- pnpm (recommended) or npm
- Python 3.10+ (whichever your `server/` requirements support)

## Quick Start (Local Development)

### 1) Backend (FastAPI)

1. Install Python dependencies:

```bash
pip install -r server/requirements.txt
```

2. Configure environment variables:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. Run the API:

```bash
uvicorn server.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### 2) Frontend (Next.js)

1. Install dependencies:

```bash
cd frontend
pnpm install
```

2. Configure environment variables:

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the frontend:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## How It Works (High Level)

1. You enter a prompt in the frontend.
2. The frontend calls the backend `POST /generate`.
3. The backend asks Gemini to generate Python code that uses `python-docx`.
4. The backend executes the code to produce a `.docx` file under `server/generated_files/`.
5. The backend returns a download URL and the frontend lets you download the generated document.

## API Endpoints (Backend)

- `POST /generate`
- `GET /download/{filename}`
- `DELETE /cleanup`

## Documentation

- Frontend docs: `frontend/README.md`
- Backend docs: `server/README.md`
- Backend architecture: `server/ARCHITECTURE.md`
- Backend getting started: `server/GETTING_STARTED.md`

## License

MIT
