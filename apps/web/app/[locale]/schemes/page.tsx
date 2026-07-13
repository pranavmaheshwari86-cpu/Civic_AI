"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Sparkles, Bookmark } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <div className="px-6 lg:px-12 py-8 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-6">Filter Results</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
                <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>All India</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Age Group</label>
                <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Any Age</option>
                  <option>18-25 Years</option>
                  <option>Senior Citizen (60+)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Annual Income</label>
                <select className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Any Income</option>
                  <option>Below 2.5L</option>
                  <option>2.5L - 5L</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20">
              <Sparkles className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-2">Need Help Finding?</h3>
              <p className="text-xs text-muted-foreground mb-4">Let our AI assistant find the exact schemes you qualify for.</p>
              <Button variant="outline" className="w-full text-xs font-semibold h-9 rounded-lg border-primary/20 hover:bg-primary/5">
                Chat with AI
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Discover Your Benefits</h1>
            <p className="text-muted-foreground">Search across 10,000+ state and central government services.</p>
            
            <div className="mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tell me what you need..."
                className="w-full bg-card border-0 shadow-ambient rounded-2xl py-4 pl-12 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground font-medium mr-2">Try asking:</span>
              <button onClick={() => setQuery('Higher Education Grants')} className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors">Higher Education Grants</button>
              <button onClick={() => setQuery('Farming Equipment Subsidy')} className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors">Farming Equipment Subsidy</button>
              <button onClick={() => setQuery('Startup Funding')} className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors">Startup Funding</button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.map((item) => (
                <Card key={item._id} className="p-6 bg-card border-0 shadow-ambient hover:shadow-premium transition-all duration-300 rounded-[1.5rem] flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 border-0 rounded-full px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      98% Match
                    </Badge>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground leading-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 mb-6 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dept:</span>
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-foreground">
                        {item.department}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-11">
                        Quick Apply
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl h-11 border-border text-foreground hover:bg-muted">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {data?.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <p className="text-lg">No schemes found matching your search.</p>
                  <button onClick={() => setQuery('')} className="mt-4 text-primary font-semibold hover:underline">Clear filters</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
