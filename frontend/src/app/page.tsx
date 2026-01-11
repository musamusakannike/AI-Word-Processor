import Hero from '@/components/Hero';
import DocumentGenerator from '@/components/DocumentGenerator';
import Footer from '@/components/Footer';

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
        <DocumentGenerator />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

