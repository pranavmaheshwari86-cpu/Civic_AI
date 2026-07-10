import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-extrabold text-primary/20 mb-4" aria-hidden="true">404</p>
      <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
        We couldn&apos;t find the page you were looking for. It may have moved or never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Go to Homepage
        </Link>
        <Link
          href="/schemes"
          className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-semibold px-6 py-3 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Browse Services
        </Link>
      </div>
    </div>
  );
}
