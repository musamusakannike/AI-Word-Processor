'use client';

import { useState, useEffect } from 'react';
import { FileText, Briefcase, Receipt, Presentation, Clipboard, Folder, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    prompt: string;
    icon: string;
}

interface TemplateGalleryProps {
    onSelectTemplate: (prompt: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
    'briefcase': <Briefcase className="w-6 h-6" />,
    'receipt': <Receipt className="w-6 h-6" />,
    'file-text': <FileText className="w-6 h-6" />,
    'presentation': <Presentation className="w-6 h-6" />,
    'clipboard': <Clipboard className="w-6 h-6" />,
    'folder': <Folder className="w-6 h-6" />,
};

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/templates`);
            if (response.data.success) {
                setTemplates(response.data.templates);
            } else {
                setError('Failed to load templates');
            }
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
    const filteredTemplates = selectedCategory === 'All' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 bg-destructive/5 text-destructive border border-destructive/20 rounded-2xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Document Templates</h2>
                <div className="flex gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedCategory === category
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-white/50 dark:bg-slate-800/50 text-muted-foreground hover:bg-white/80 dark:hover:bg-slate-800/80 border border-border'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={() => onSelectTemplate(template.prompt)}
                    />
                ))}
            </div>
        </div>
    );
}

interface TemplateCardProps {
    template: Template;
    onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
    const icon = iconMap[template.icon] || <FileText className="w-6 h-6" />;

    return (
        <button
            onClick={onSelect}
            className="group text-left p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {template.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Use template</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </button>
    );
}
