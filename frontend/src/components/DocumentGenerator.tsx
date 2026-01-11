'use client';

import { useState } from 'react';
import TiptapEditor from './TiptapEditor';
import { Wand2, Download, Loader2, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
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
    const [editorContent, setEditorContent] = useState('<p>Your generated document will appear here...</p>');
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
            const response = await axios.post<GenerateResponse>(`${API_BASE_URL}/generate`, {
                prompt: prompt,
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Prompt Input */}
                <div className="space-y-6 animate-slide-in">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Describe Your Document
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Tell us what kind of document you need, and we'll create it for you.
                        </p>
                    </div>

                    {/* Prompt Input */}
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Example: Create a professional business proposal for a software development project. Include sections for executive summary, project scope, timeline, budget, and team qualifications. Use formal language and add a table for the budget breakdown."
                            className="w-full h-64 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all duration-200 resize-none"
                            disabled={isGenerating}
                        />
                        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                            {prompt.length} characters
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                Generate Document
                            </>
                        )}
                    </button>

                    {/* Status Messages */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-scale-in">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Error</h4>
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-scale-in">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Success</h4>
                                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Download Button */}
                    {downloadUrl && (
                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 animate-scale-in"
                        >
                            <Download className="w-5 h-5" />
                            Download {filename || 'Document'}
                        </button>
                    )}

                    {/* Example Prompts */}
                    <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Example Prompts
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <button
                                    onClick={() => setPrompt('Create a meeting agenda for a quarterly business review with sections for objectives, discussion topics, action items, and next steps.')}
                                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Meeting agenda for quarterly business review
                                </button>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <button
                                    onClick={() => setPrompt('Generate a professional resume with sections for summary, work experience, education, and skills. Use modern formatting with bullet points.')}
                                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Professional resume template
                                </button>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <button
                                    onClick={() => setPrompt('Create a project proposal with executive summary, problem statement, proposed solution, timeline with milestones, budget breakdown table, and risk assessment.')}
                                    className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Project proposal with budget table
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Column - Editor Preview */}
                <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Edit & Preview
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Fine-tune your document with our rich text editor.
                        </p>
                    </div>

                    <TiptapEditor content={editorContent} onChange={setEditorContent} />

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong className="text-gray-900 dark:text-white">Note:</strong> The editor is for preview and manual editing.
                            Generated documents are created server-side and can be downloaded as DOCX files.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
