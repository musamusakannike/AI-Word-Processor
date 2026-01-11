'use client';

import { Sparkles, FileText, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="text-center animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 mb-8 animate-scale-in">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            AI-Powered Document Generation
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        <span className="block text-gray-900 dark:text-white">
                            Create Documents
                        </span>
                        <span className="block gradient-text mt-2">
                            With AI Magic
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-12">
                        Transform your ideas into professional Word documents instantly.
                        Just describe what you need, and let AI do the heavy lifting.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                        <FeatureCard
                            icon={<Sparkles className="w-6 h-6" />}
                            title="AI-Powered"
                            description="Advanced AI generates perfect documents from your prompts"
                            gradient="from-purple-500 to-pink-500"
                        />
                        <FeatureCard
                            icon={<FileText className="w-6 h-6" />}
                            title="Edit & Export"
                            description="Edit with our rich text editor and download as DOCX"
                            gradient="from-indigo-500 to-purple-500"
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Lightning Fast"
                            description="Generate professional documents in seconds"
                            gradient="from-blue-500 to-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    <path
                        d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                        className="fill-white dark:fill-gray-900"
                    />
                </svg>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 animate-scale-in">
            <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                {description}
            </p>
        </div>
    );
}
