'use client';

import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import * as mammoth from 'mammoth';
import {
  AlertCircle,
  Bot,
  Download,
  FileUp,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import TiptapEditor from '@/components/TiptapEditor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ExportResponse = {
  success: boolean;
  message: string;
  download_url?: string;
  filename?: string;
  error?: string;
};

type AiEditResponse = {
  success: boolean;
  message: string;
  updated_html?: string;
  error?: string;
};

export default function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [documentName, setDocumentName] = useState<string>('Untitled');
  const [editorContent, setEditorContent] = useState<string>(
    '<p class="text-muted-foreground italic">Import a DOCX to start editing, or begin typing.</p>',
  );

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAiWorking, setIsAiWorking] = useState(false);

  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);

  const canRestore = useMemo(() => Boolean(lastSnapshot), [lastSnapshot]);

  const handlePickFile = () => {
    setError(null);
    setStatus(null);
    fileInputRef.current?.click();
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    setError(null);
    setStatus(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      const nextHtml = result.value?.trim();
      if (!nextHtml) {
        throw new Error('Could not extract editable content from this DOCX.');
      }

      setLastSnapshot(editorContent);
      setEditorContent(nextHtml);
      setDocumentName(file.name.replace(/\.docx$/i, '') || 'Untitled');
      setStatus('Document imported.');

      if (result.messages?.length) {
        const warning = result.messages.map((m: { message: string }) => m.message).join(' ');
        setStatus(`Document imported. Some formatting may not be perfect: ${warning}`);
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message || 'Failed to import DOCX.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setStatus(null);

    try {
      const response = await axios.post<ExportResponse>(`${API_BASE_URL}/export`, {
        html: editorContent,
        filename: `${documentName || 'document'}.docx`,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || response.data.message || 'Export failed.');
      }

      if (!response.data.download_url) {
        throw new Error('Export succeeded, but no download URL was returned.');
      }

      setStatus('DOCX export ready.');
      window.open(`${API_BASE_URL}${response.data.download_url}`, '_blank');
    } catch (e: unknown) {
      const err = e as { message?: string; response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail || err.message || 'Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreSnapshot = () => {
    if (!lastSnapshot) {
      return;
    }
    setEditorContent(lastSnapshot);
    setLastSnapshot(null);
    setStatus('Reverted last change.');
  };

  const handleAiApply = async () => {
    if (!aiInstruction.trim()) {
      setError('Please enter an AI instruction.');
      return;
    }

    setIsAiWorking(true);
    setError(null);
    setStatus(null);

    try {
      const response = await axios.post<AiEditResponse>(`${API_BASE_URL}/ai/edit`, {
        html: editorContent,
        instruction: aiInstruction,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || response.data.message || 'AI edit failed.');
      }

      if (!response.data.updated_html) {
        throw new Error('AI edit succeeded, but no updated document was returned.');
      }

      setLastSnapshot(editorContent);
      setEditorContent(response.data.updated_html);
      setStatus('AI changes applied.');
      setAiInstruction('');
      setIsAiOpen(false);
    } catch (e: unknown) {
      const err = e as { message?: string; response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail || err.message || 'AI edit failed.');
    } finally {
      setIsAiWorking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">Document Editor</h1>
                  <span className="hidden sm:inline text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                    {documentName}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Import a DOCX, edit, export — and use AI to transform your document.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg border border-border bg-white/60 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/50 text-sm font-medium transition-colors"
              >
                Home
              </Link>

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  void handleImport(file);
                  e.target.value = '';
                }}
              />

              <button
                type="button"
                onClick={handlePickFile}
                disabled={isImporting}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-900/40 border border-border hover:bg-white/90 dark:hover:bg-slate-900/60 text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                Import DOCX
              </button>

              <button
                type="button"
                onClick={() => setIsAiOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-lg shadow-primary/25 transition-all"
              >
                <Bot className="w-4 h-4" />
                AI Edit
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export DOCX
              </button>

              <button
                type="button"
                onClick={handleRestoreSnapshot}
                disabled={!canRestore}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white/60 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/50 text-sm font-semibold transition-all disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Undo last
              </button>
            </div>
          </div>

          {(error || status) && (
            <div className="mt-4">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-destructive/5 text-destructive border border-destructive/20 rounded-2xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Something went wrong</div>
                    <div className="text-sm opacity-90">{error}</div>
                  </div>
                </div>
              )}
              {!error && status && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-sm text-muted-foreground">
                  {status}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="glass-card rounded-3xl p-1 border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            <TiptapEditor content={editorContent} onChange={setEditorContent} />
          </div>
        </div>
      </div>

      {isAiOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => (isAiWorking ? null : setIsAiOpen(false))}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">AI Edit</h2>
                    <p className="text-xs text-muted-foreground">
                      Describe the change you want. The AI will return an updated document.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (isAiWorking ? null : setIsAiOpen(false))}
                className="px-3 py-2 rounded-lg border border-border bg-white/60 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/50 text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-6 flex-1 flex flex-col gap-3">
              <label className="text-sm font-semibold">Instruction</label>
              <textarea
                value={aiInstruction}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAiInstruction(e.target.value)}
                placeholder="e.g. Improve the wording, fix grammar, add a short executive summary at the top, and convert headings into a consistent style."
                className="w-full flex-1 min-h-[220px] px-4 py-3 rounded-2xl border border-input bg-background/50 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                disabled={isAiWorking}
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setAiInstruction('')}
                  disabled={isAiWorking || !aiInstruction}
                  className="px-4 py-3 rounded-xl border border-border bg-white/60 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/50 text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => void handleAiApply()}
                  disabled={isAiWorking || !aiInstruction.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                >
                  {isAiWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Apply
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                Tip: for best results, mention specific sections ("introduction", "conclusion") and the tone ("formal", "friendly").
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
