
import { BrainCircuit } from 'lucide-react'; 
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <BrainCircuit className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-3xl font-bold text-primary group-hover:text-primary/90 transition-colors">Assistila</h1>
        </Link>
      </div>
    </header>
  );
}
