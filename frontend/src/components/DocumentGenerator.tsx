'use client';

import { useState, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';
import { Wand2, Download, Loader2, AlertCircle, CheckCircle2, Lightbulb, FileEdit, ArrowRight, Upload, X, FileText, File as FileIcon } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface GenerateResponse {
    success: boolean;
    message: string;
    download_url?: string;
    filename?: string;
    generated_code?: string;
    error?: string;
}

export default function DocumentGenerator() {
    const [prompt, setPrompt] = useState('');
    const [editorContent, setEditorContent] = useState('<p class="text-muted-foreground italic">Your generated document will appear here...</p>');
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // File validation constants
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.docx'];

    const validateFile = (file: File): string | null => {
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
            return `Unsupported file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        }
        return null;
    };

    const handleFileSelect = (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setFileError(validationError);
            setSelectedFile(null);
        } else {
            setFileError(null);
            setSelectedFile(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileError(null);
    };

    useEffect(() => {
        const templatePrompt = sessionStorage.getItem('selectedTemplatePrompt');
        if (templatePrompt) {
            setPrompt(templatePrompt);
            sessionStorage.removeItem('selectedTemplatePrompt');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setSuccess(null);
        setDownloadUrl(null);

        try {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('prompt', prompt);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axios.post<GenerateResponse>(`${API_BASE_URL}/generate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setDownloadUrl(response.data.download_url || null);
                setFilename(response.data.filename || null);

                // Update editor with a success message
                setEditorContent(`
          <h2>✨ Document Generated Successfully!</h2>
          <p>Your document has been created and is ready for download.</p>
          <p><strong>Filename:</strong> ${response.data.filename}</p>
          ${selectedFile ? `<p><strong>Source:</strong> ${selectedFile.name}</p>` : ''}
          <p>You can now download the DOCX file using the button below, or edit this content and generate a new document.</p>
        `);
            } else {
                setError(response.data.error || 'Failed to generate document');
            }
        } catch (err: unknown) {
            console.error('Error generating document:', err);
            const error = err as { response?: { data?: { detail?: string } }; message?: string };
            setError(error.response?.data?.detail || error.message || 'An error occurred while generating the document');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            window.open(`${API_BASE_URL}${downloadUrl}`, '_blank');
        }
    };

    const setExamplePrompt = (text: string) => {
        setPrompt(text);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Left Column - Prompt Input */}
                <div className="space-y-8 animate-slide-in">
                    <div className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <Wand2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Describe Your Document
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-muted-foreground w-full">
                                What would you like to create today?
                            </label>

                            <div className="relative group">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Create a comprehensive marketing proposal for a new coffee brand..."
                                    className="w-full h-48 px-4 py-4 rounded-xl border border-input bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-none leading-relaxed shadow-sm group-hover:shadow-md"
                                    disabled={isGenerating}
                                />
                                <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground/60 bg-background/80 px-2 py-1 rounded-md backdrop-blur-md">
                                    {prompt.length} chars
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-muted-foreground">
                                    Source Document (Optional)
                                </label>

                                {!selectedFile ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`relative group border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging
                                            ? 'border-primary bg-primary/5 scale-[1.02]'
                                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept=".pdf,.txt,.docx"
                                            onChange={handleFileInputChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={isGenerating}
                                        />
                                        <div className="p-8 text-center">
                                            <div className="flex justify-center mb-4">
                                                <div className={`p-4 rounded-2xl transition-all duration-300 ${isDragging
                                                    ? 'bg-primary/20 scale-110'
                                                    : 'bg-primary/10 group-hover:bg-primary/15'
                                                    }`}>
                                                    <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-primary/70'
                                                        }`} />
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-foreground mb-1">
                                                {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                                            </p>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                or click to browse
                                            </p>
                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>PDF, TXT, DOCX • Max 20MB</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group border border-border rounded-xl p-4 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                                                {selectedFile.name.endsWith('.pdf') ? (
                                                    <FileText className="w-6 h-6 text-primary" />
                                                ) : (
                                                    <FileIcon className="w-6 h-6 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleRemoveFile}
                                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group/btn"
                                                disabled={isGenerating}
                                            >
                                                <X className="w-4 h-4 text-muted-foreground group-hover/btn:text-destructive transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {fileError && (
                                    <div className="flex items-start gap-2 p-3 bg-destructive/5 text-destructive border border-destructive/20 rounded-lg text-xs">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{fileError}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Magic...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Generate Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="flex items-start gap-4 p-4 bg-destructive/5 text-destructive border border-destructive/20 rounded-2xl animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold mb-1">Generation Failed</h4>
                                <p className="text-sm opacity-90">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-4 p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl animate-fade-in">
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold mb-1">Success!</h4>
                                <p className="text-sm opacity-90">{success}</p>
                            </div>
                        </div>
                    )}

                    {downloadUrl && (
                        <button
                            onClick={handleDownload}
                            className="w-full group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-300 animate-scale-in"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-6" />
                            <Download className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Download {filename || 'Document'}</span>
                        </button>
                    )}

                    {/* Example Prompts */}
                    <div className="pt-6">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                            <Lightbulb className="w-4 h-4" />
                            Try these examples
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <ExamplePrompt
                                onClick={() => setExamplePrompt('Write a professional cover letter based on the uploaded resume. Highlight relevant experience and skills for the target position.')}
                                title="📎 Cover Letter from Resume"
                                description="Upload your resume and generate a tailored cover letter."
                            />
                            <ExamplePrompt
                                onClick={() => setExamplePrompt('Create a meeting agenda for a quarterly business review with sections for objectives, discussion topics, action items, and next steps.')}
                                title="Quarterly Business Review Agenda"
                                description="Structure your QBR meeting efficiently."
                            />
                            <ExamplePrompt
                                onClick={() => setExamplePrompt('Generate a professional resume with sections for summary, work experience, education, and skills. Use modern formatting with bullet points.')}
                                title="Professional Resume Template"
                                description="Stand out with a clean resume layout."
                            />
                            <ExamplePrompt
                                onClick={() => setExamplePrompt('Create a project proposal with executive summary, problem statement, proposed solution, timeline with milestones, budget breakdown table, and risk assessment.')}
                                title="Detailed Project Proposal"
                                description="Comprehensive proposal with budget tables."
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Editor Preview */}
                <div className="lg:h-[calc(100vh-200px)] lg:sticky lg:top-8 animate-slide-in flex flex-col" style={{ animationDelay: '0.1s' }}>
                    <div className="glass-card rounded-3xl p-1 border border-white/20 dark:border-white/10 shadow-2xl flex-1 flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border p-4 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-black/5 dark:border-white/5">
                                    <FileEdit className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Visual Preview</h3>
                                    <p className="text-xs text-muted-foreground">Rich text editor</p>
                                </div>
                            </div>
                            <div className="text-xs font-medium px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Preview Mode
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950/50 relative">
                            {/* Editor wrapper with custom scrollbar styling if needed */}
                            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                                <TiptapEditor content={editorContent} onChange={setEditorContent} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
                        <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Pro Tip:</strong> The editor above shows a preview. The actual DOCX file is generated server-side for maximum compatibility with Microsoft Word.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExamplePrompt({ onClick, title, description }: { onClick: () => void, title: string, description: string }) {
    return (
        <button
            onClick={onClick}
            className="group w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between"
        >
            <div>
                <span className="block font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {title}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                    {description}
                </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
        </button>
    );
}
