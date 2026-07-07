'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, BookOpen, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface CatalogItem {
  _id: string;
  type: 'scheme' | 'service';
  title: string;
  description: string;
  department: string;
  eligibilityCriteria: string[];
}

export default function SchemesPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { language } = useAppStore();

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['catalog', debouncedQuery, language],
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/catalog/search`);
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      url.searchParams.set('lang', language);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch schemes');
      return res.json() as Promise<CatalogItem[]>;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Government Schemes & Services</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Search across thousands of state and central government services. Find what you&apos;re eligible for in seconds.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Scholarship for girls in Karnataka' or 'Passport renewal'"
          className="w-full bg-card border-2 border-border rounded-full py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-primary transition-colors shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((item) => (
            <div key={item._id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {item.type === 'scheme' ? <BookOpen className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                {item.type}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="mt-auto">
                <div className="text-sm font-medium bg-muted px-3 py-1 rounded-md inline-block mb-4">
                  {item.department}
                </div>
                
                <button className="w-full bg-secondary text-secondary-foreground font-semibold py-2 rounded-lg hover:bg-secondary/80 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
          
          {data?.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <p className="text-lg">No schemes found matching your search.</p>
              <button className="mt-4 text-primary hover:underline">Try a different keyword</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
