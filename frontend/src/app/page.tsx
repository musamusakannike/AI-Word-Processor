import Hero from '@/components/Hero';
import DocumentGenerator from '@/components/DocumentGenerator';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <main className="flex-1 bg-white dark:bg-gray-900">
        <DocumentGenerator />
      </main>
      <Footer />
    </div>
  );
}

