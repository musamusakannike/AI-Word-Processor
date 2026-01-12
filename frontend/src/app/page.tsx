import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-background selection:bg-primary/30">

      {/* Global Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-soft-light opacity-50 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-soft-light opacity-50 animate-float" style={{ animationDelay: '4s' }} />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px] mask-image:linear-gradient(to_bottom,transparent,black)"></div>
      </div>

      <main className="flex-1 relative z-10 flex flex-col">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Get Started</h2>
                <p className="text-muted-foreground mt-2">
                  Create a new document with AI, or open an existing DOCX and edit it with an AI assistant.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/editor"
                  className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="relative z-10">Open & Edit a DOCX</span>
                </Link>
                <Link
                  href="/generate"
                  className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4 bg-white/70 dark:bg-slate-900/40 hover:bg-white/90 dark:hover:bg-slate-900/60 text-foreground font-semibold rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="relative z-10">Generate with AI</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

