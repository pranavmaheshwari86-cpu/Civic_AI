'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, BookOpen, ExternalLink, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import localSchemes from '@/data/governmentSchemes.json';

// Normalize local JSON to the shape the UI expects
interface SchemeItem {
  id: string;
  type: 'scheme' | 'service';
  title: string;
  description: string;
  department: string;
  eligibilityCriteria: string[];
  officialLink?: string;
}

function normalizeLocalSchemes(query: string): SchemeItem[] {
  const q = query.toLowerCase();
  return localSchemes
    .filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.benefits.some((b) => b.toLowerCase().includes(q))
    )
    .map((s) => ({
      id: s.id,
      type: 'scheme' as const,
      title: s.name,
      description: s.benefits.join('. '),
      department: s.requiredDocuments.length > 0 ? 'Central Government' : 'Government of India',
      eligibilityCriteria: s.eligibilityCriteria.occupations ?? [],
      officialLink: s.officialLink,
    }));
}

export default function SchemesPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { language } = useAppStore();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['catalog', debouncedQuery, language],
    queryFn: async () => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/catalog/search`
      );
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      url.searchParams.set('lang', language);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch schemes');

      const raw = await res.json();

      // Normalise API response — backend returns either CatalogItem[] or
      // a shape with _id/title/description/department/eligibilityCriteria/type
      // so we defensively map it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (raw as any[]).map((item): SchemeItem => ({
        id: item._id ?? item.id,
        type: item.type ?? 'scheme',
        title: item.title ?? item.name,
        description: item.description ?? '',
        department: item.department ?? '',
        eligibilityCriteria: Array.isArray(item.eligibilityCriteria)
          ? item.eligibilityCriteria
          : [],
        officialLink: item.officialLink,
      }));
    },
    retry: 1,
  });

  // Fallback to local JSON if API fails
  const items: SchemeItem[] = isError
    ? normalizeLocalSchemes(debouncedQuery)
    : (data ?? []);

  const showFallbackNotice = isError;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-balance">
          Government Schemes &amp; Services
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
          Search across thousands of state and central government services. Find what you&apos;re eligible for in seconds.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <label htmlFor="schemes-search" className="sr-only">
          Search government schemes and services
        </label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="schemes-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. &quot;Scholarship for girls&quot; or &quot;Passport renewal&quot;"
          className="w-full bg-card border-2 border-border rounded-full py-3.5 pl-12 pr-12 text-base focus:outline-none focus:border-primary transition-colors shadow-sm"
          aria-label="Search schemes"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Fallback notice */}
      {showFallbackNotice && (
        <div
          role="status"
          aria-live="polite"
          className="max-w-2xl mx-auto mb-6 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-foreground/80"
        >
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Could not reach the live database. Showing offline scheme data.
          </span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div
          className="flex justify-center items-center py-20"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Loading schemes...</span>
        </div>
      )}

      {/* Results grid */}
      {!isLoading && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-label={`${items.length} scheme${items.length !== 1 ? 's' : ''} found`}
          aria-live="polite"
          aria-atomic="false"
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                {item.type}
              </div>
              <h2 className="text-base font-bold mb-2 leading-snug">{item.title}</h2>
              <p className="text-muted-foreground text-sm flex-1 mb-4 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-auto space-y-3">
                {item.department && (
                  <span className="text-xs font-medium bg-muted px-3 py-1 rounded-md inline-block">
                    {item.department}
                  </span>
                )}

                {item.officialLink ? (
                  <a
                    href={item.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px]"
                    aria-label={`Apply for ${item.title} — opens official government portal`}
                  >
                    Apply on Official Portal
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="w-full bg-secondary text-secondary-foreground text-sm font-semibold py-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px]"
                    aria-label={`View details for ${item.title}`}
                  >
                    View Details
                  </button>
                )}
              </div>
            </article>
          ))}

          {items.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p className="text-base font-medium">No schemes found for &ldquo;{query}&rdquo;</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-primary hover:underline text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Clear search and browse all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
