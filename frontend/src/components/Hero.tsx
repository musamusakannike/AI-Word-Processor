"use client";

import { Sparkles, FileText, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-transparent selection:bg-primary/30">
      {/* Background moved to page.tsx for global consistency */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center z-10">
        {/* Badge */}
        <div
          className="animate-fade-in opacity-0"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm mb-8 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              By{" "}
              <Link
                href="https://github.com/musamusakannike"
                target="_blank"
                className="underline"
              >
                Musamusakannike
              </Link>
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-fade-in opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="block text-foreground drop-shadow-sm">
            Create Documents
          </span>
          <span className="block gradient-text mt-2 pb-4">With AI Magic</span>
        </h1>

        {/* Description */}
        <p
          className="max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed animate-fade-in opacity-0"
          style={{ animationDelay: "0.3s" }}
        >
          Transform your ideas into professional Word documents instantly. Just
          describe what you need, and let our advanced AI do the heavy lifting
          in seconds.
        </p>

        {/* Call to Action Buttons - Optional if we had navigation, but good for visual hierarchy */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
                    <button className="px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-foreground font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300">
                        View Examples
                    </button>
                 </div> */}

        {/* Feature Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-fade-in opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          <FeatureCard
            image="/ai.png"
            icon={<Sparkles className="w-6 h-6 text-purple-500" />}
            title="AI-Powered"
            description="Advanced AI generates perfect documents from your prompts."
          />
          <FeatureCard
            image="/doc.png"
            icon={<FileText className="w-6 h-6 text-blue-500" />}
            title="Edit & Export"
            description="Edit with our rich text editor and download as DOCX instantly."
          />
          <FeatureCard
          image="/clock.png"
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Lightning Fast"
            description="Generate professional documents in seconds, not hours."
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image?: string;
}

function FeatureCard({ icon, title, description, image }: FeatureCardProps) {
  return (
    <div className="group glass-card p-8 rounded-2xl hover-lift text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      {image ? (
        <div className="inline-flex p-3 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-700">
        <Image
          src={image}
          alt={title}
          className="w-6 h-6"
          width={24}
          height={24}
        /></div>
      ) : (
        <div className="inline-flex p-3 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-700">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
