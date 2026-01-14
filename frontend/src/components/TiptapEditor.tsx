'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Code,
    Undo,
    Redo,
    Table as TableIcon,
    Sparkles,
    Loader2,
} from 'lucide-react';
import axios from 'axios';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define toolbar button component outside of render
const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
            }`}
        title={title}
        type="button"
    >
        {children}
    </button>
);

// Define toolbar divider component outside of render
const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
);

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const isProgrammaticUpdateRef = useRef(false);
    const [isRefining, setIsRefining] = useState(false);
    const [refinementError, setRefinementError] = useState<string | null>(null);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-gray-300 dark:border-gray-600',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 dark:bg-gray-700 font-bold',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 dark:border-gray-600 px-3 py-2',
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (isProgrammaticUpdateRef.current) {
                return;
            }
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none p-6',
            },
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const current = editor.getHTML();
        if (current === content) {
            return;
        }

        isProgrammaticUpdateRef.current = true;
        editor.commands.setContent(content, { emitUpdate: false });
        queueMicrotask(() => {
            isProgrammaticUpdateRef.current = false;
        });
    }, [content, editor]);

    const handleAiRefine = async () => {
        if (!editor) return;
        
        const { from, to } = editor.state.selection;
        if (from === to) {
            setRefinementError('Please select some text to refine');
            setTimeout(() => setRefinementError(null), 3000);
            return;
        }
        
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        
        setIsRefining(true);
        setRefinementError(null);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/ai/refine`, {
                text: selectedText,
            });
            
            if (response.data.success && response.data.refined_text) {
                editor.chain().focus().deleteSelection().insertContent(response.data.refined_text).run();
            } else {
                throw new Error(response.data.error || 'Failed to refine text');
            }
        } catch (error: any) {
            console.error('Error refining text:', error);
            setRefinementError(error.response?.data?.error || error.message || 'Failed to refine text');
            setTimeout(() => setRefinementError(null), 5000);
        } finally {
            setIsRefining(false);
        }
    };
    
    if (!editor) {
        return null;
    }

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                <div className="flex flex-wrap gap-1 items-center">
                    {/* History */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Undo"
                    >
                        <Undo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Redo"
                    >
                        <Redo size={18} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Text Formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 size={18} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered size={18} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Other */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code size={18} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Table Controls */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        title="Insert Table"
                    >
                        <TableIcon size={18} />
                    </ToolbarButton>
                    {editor.isActive('table') && (
                        <>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().addColumnBefore().run()}
                                title="Add Column Before"
                            >
                                <span className="text-xs font-bold">C+</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                                title="Add Row Before"
                            >
                                <span className="text-xs font-bold">R+</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                title="Delete Column"
                            >
                                <span className="text-xs font-bold">C-</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                title="Delete Row"
                            >
                                <span className="text-xs font-bold">R-</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                title="Delete Table"
                            >
                                <span className="text-xs font-bold">Del</span>
                            </ToolbarButton>
                        </>
                    )}

                    <ToolbarDivider />

                    {/* AI Refine Button */}
                    <button
                        onClick={handleAiRefine}
                        disabled={isRefining}
                        className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            isRefining
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg'
                        }`}
                        title="Refine selected text with AI"
                        type="button"
                    >
                        {isRefining ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm font-medium">Refining...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span className="text-sm font-medium">AI Refine</span>
                            </>
                        )}
                    </button>
                </div>
                {refinementError && (
                    <div className="mt-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg">
                        {refinementError}
                    </div>
                )}
            </div>

            {/* Editor Content */}
            <div className="bg-white dark:bg-gray-800">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
