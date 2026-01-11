# AI Word Processor - Frontend

A beautiful, modern web application for generating professional Word documents using AI. Built with Next.js, React, Tailwind CSS, and Tiptap editor.

## Features

✨ **AI-Powered Document Generation**

- Generate professional DOCX files from natural language prompts
- Powered by Google's Gemini AI
- Intelligent code generation for complex document structures

📝 **Rich Text Editor**

- Full-featured Tiptap editor with comprehensive formatting options
- Text formatting: Bold, Italic, Underline, Strikethrough, Highlight
- Headings (H1, H2, H3)
- Lists (Bullet and Numbered)
- Text alignment (Left, Center, Right, Justify)
- Blockquotes and Code blocks
- Links, Images, and Tables
- Undo/Redo functionality

🎨 **Modern UI/UX**

- Beautiful gradient-based design system
- Smooth animations and transitions
- Glassmorphism effects
- Dark mode support
- Fully responsive layout
- Premium, state-of-the-art design

⚡ **Performance**

- Built with Next.js 16 and React 19
- Turbopack for fast development
- Optimized for production

## Tech Stack

- **Framework**: Next.js 16.1.1
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Editor**: Tiptap 3.15.3
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
```

1. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

1. Start the development server:

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and design system
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   └── components/
│       ├── Hero.tsx             # Hero section with animated background
│       ├── DocumentGenerator.tsx # Main document generation component
│       ├── TiptapEditor.tsx     # Rich text editor component
│       └── Footer.tsx           # Footer component
├── public/                      # Static assets
└── package.json
```

## Components

### Hero

Eye-catching hero section with:

- Animated gradient background
- Floating elements
- Feature cards
- Wave divider

### DocumentGenerator

Main application component featuring:

- Prompt input with character counter
- AI document generation
- Status messages (success/error)
- Download functionality
- Example prompts for inspiration
- Integration with Tiptap editor

### TiptapEditor

Full-featured rich text editor with:

- Comprehensive toolbar
- Real-time editing
- HTML content output
- Responsive design

### Footer

Clean footer with:

- Brand information
- Quick links
- Social media icons
- Copyright notice

## Design System

The application uses a comprehensive design system with:

### Colors

- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Purple (#8b5cf6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)

### Gradients

- Primary: Purple to Pink
- Secondary: Pink to Red
- Accent: Blue to Cyan
- And more...

### Typography

- Font: Inter (Google Fonts)
- Weights: 300-900
- Optimized for readability

### Animations

- Fade in
- Slide in
- Scale in
- Pulse
- Float

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

### Endpoints Used

- `POST /generate` - Generate a DOCX document from a prompt
- `GET /download/{filename}` - Download a generated document

### Example Request

```typescript
const response = await axios.post(`${API_BASE_URL}/generate`, {
  prompt: "Create a professional business proposal..."
});
```

## Usage

1. **Enter a Prompt**: Describe the document you want to create in the text area
2. **Generate**: Click the "Generate Document" button
3. **Wait**: The AI will process your request (usually takes a few seconds)
4. **Download**: Once generated, download your DOCX file
5. **Edit** (Optional): Use the Tiptap editor to preview and edit content

### Example Prompts

- "Create a meeting agenda for a quarterly business review with sections for objectives, discussion topics, action items, and next steps."
- "Generate a professional resume with sections for summary, work experience, education, and skills."
- "Create a project proposal with executive summary, problem statement, proposed solution, timeline, budget table, and risk assessment."

## Customization

### Changing the API URL

Update the `NEXT_PUBLIC_API_URL` in your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Styling

The design system is defined in `src/app/globals.css`. You can customize:

- Color palette
- Gradients
- Shadows
- Spacing
- Border radius
- Animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Editor powered by [Tiptap](https://tiptap.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
