'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';

// Interface
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
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/services/search`);
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      url.searchParams.set('lang', language);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch schemes');
      const data = await res.json();
      return (data.services || []).map((s: any) => ({
        _id: s.serviceId || s._id,
        type: 'service',
        title: s.serviceName || s.schemeName,
        description: s.description,
        department: s.department,
        eligibilityCriteria: []
      })) as CatalogItem[];
    },
  });

  return (
    <div className="p-gutter lg:p-xl max-w-[1600px] w-full mx-auto relative min-h-screen flex flex-col md:flex-row gap-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-fixed-dim/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-fixed/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* Advanced Filters Sidebar Section (Local to Schemes Page) */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
          <h3 className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-4">Advanced Filters</h3>
          <div className="space-y-6">
            {/* Location Filter */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Location</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">location_on</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none" placeholder="State or District" type="text" />
              </div>
            </div>
            {/* Age Filter */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Age Group</label>
              <select className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none appearance-none cursor-pointer">
                <option value="">Select Age</option>
                <option value="18-25">18 - 25 Years</option>
                <option value="26-35">26 - 35 Years</option>
                <option value="36-50">36 - 50 Years</option>
                <option value="50+">50+ Years</option>
              </select>
            </div>
            {/* Income Filter */}
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Annual Income</label>
              <select className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none appearance-none cursor-pointer">
                <option value="">Select Range</option>
                <option value="below-1l">Below ₹1 Lakh</option>
                <option value="1l-3l">₹1L - ₹3 Lakh</option>
                <option value="3l-8l">₹3L - ₹8 Lakh</option>
                <option value="above-8l">Above ₹8 Lakh</option>
              </select>
            </div>
            <button className="w-full py-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg text-label-md font-label-md font-medium hover:bg-secondary-fixed-dim transition-colors mt-4">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* AI Search Section */}
        <section className="max-w-3xl mx-auto w-full mb-xl text-center">
          <h2 className="text-display-lg font-display-lg font-bold tracking-tight text-primary mb-4">Discover Your Benefits</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">Our AI engine instantly matches your profile with hundreds of government schemes, subsidies, and grants designed for you.</p>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-surface border border-outline-variant rounded-2xl shadow-ambient overflow-hidden pl-6 pr-2 py-2 focus-within:border-secondary transition-colors">
              <span className="material-symbols-outlined text-secondary text-xl mr-3">auto_awesome</span>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none text-body-lg font-body-lg text-on-surface placeholder:text-outline focus:ring-0 outline-none" 
                placeholder="Tell me what you need... (e.g., 'Looking for a business loan for women in tech')" 
              />
              <button className="ml-4 px-6 py-3 bg-primary text-on-primary rounded-xl text-label-md font-label-md font-semibold hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
                Search Schemes
              </button>
            </div>
          </div>
          {/* Quick Prompts */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="text-label-sm font-label-sm text-outline mr-2 self-center">Try asking:</span>
            <button onClick={() => setQuery('Higher Education Grants')} className="px-4 py-1.5 rounded-full border border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-low hover:border-primary transition-colors bg-surface">Higher Education Grants</button>
            <button onClick={() => setQuery('Farming Equipment Subsidy')} className="px-4 py-1.5 rounded-full border border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-low hover:border-primary transition-colors bg-surface">Farming Equipment Subsidy</button>
            <button onClick={() => setQuery('Healthcare for Seniors')} className="px-4 py-1.5 rounded-full border border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-low hover:border-primary transition-colors bg-surface">Healthcare for Seniors</button>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-lg">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-label-md font-label-md font-medium shadow-sm flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">border_all</span>
              All Categories
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-low transition-colors flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">health_and_safety</span>
              Health & Wellness
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-low transition-colors flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">school</span>
              Education
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-low transition-colors flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">agriculture</span>
              Agriculture
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-low transition-colors flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Business & MSME
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-low transition-colors flex-shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">home_work</span>
              Housing
            </button>
          </div>
        </section>

        {/* Schemes Grid */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-md font-headline-md font-bold text-on-surface">Recommended for You</h3>
            <span className="text-label-md font-label-md text-on-surface-variant">Showing {data ? data.length : 0} results</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((item, index) => (
                <div key={item._id} className="bg-surface rounded-2xl border border-outline-variant hover:border-secondary-fixed-dim shadow-sm hover:shadow-ambient transition-all duration-300 flex flex-col overflow-hidden relative group">
                  <div className={`h-1.5 w-full ${index % 3 === 0 ? 'bg-gradient-to-r from-secondary to-primary-container' : index % 3 === 1 ? 'bg-gradient-to-r from-secondary-fixed-dim to-secondary-container' : 'bg-surface-variant'}`}></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={index % 3 === 0 ? "bg-primary-fixed-dim/30 text-primary px-3 py-1 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1" : "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1"}>
                        <span className="material-symbols-outlined text-[14px]">{index % 3 === 0 ? 'check_circle' : index % 3 === 1 ? 'pie_chart' : 'info'}</span>
                        {index % 3 === 0 ? '98% Match' : index % 3 === 1 ? '85% Match' : '62% Match'}
                      </div>
                      <button className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">bookmark_border</span>
                      </button>
                    </div>
                    <h4 className="text-headline-md font-headline-md font-bold text-on-surface mb-2 leading-tight">{item.title}</h4>
                    <p className="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-2">{item.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-md text-[11px] font-label-sm uppercase tracking-wider">{item.department || 'General'}</span>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 px-4 bg-surface border border-outline-variant text-on-surface-variant rounded-lg text-label-md font-label-md font-medium hover:bg-surface-container-low transition-colors text-center">
                          View Details
                        </button>
                        <button className="flex-1 py-2.5 px-4 bg-primary text-on-primary rounded-lg text-label-md font-label-md font-medium hover:bg-primary/90 transition-colors shadow-sm text-center flex items-center justify-center gap-2 ai-aura">
                          Quick Apply
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {data?.length === 0 && (
                <div className="col-span-full py-xl flex flex-col items-center justify-center text-center bg-surface-container-lowest border border-outline-variant/50 rounded-2xl border-dashed">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline mb-6">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                  </div>
                  <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-2">No exact matches found</h3>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-6 max-w-md">We couldn't find a scheme matching all your specific filters. Try broadening your search or let our AI guide you.</p>
                  <button onClick={() => setQuery('')} className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-xl text-label-md font-label-md font-semibold hover:bg-secondary-container/90 transition-colors shadow-sm flex items-center gap-2">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
