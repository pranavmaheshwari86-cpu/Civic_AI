'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface CatalogItem {
  _id: string;
  title: string;
  type: string;
  department: string;
}

export function CatalogTab() {
  const { data: catalog, isLoading: loadingCatalog } = useQuery({
    queryKey: ['admin-catalog'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/services/search?q=`);
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const json = await res.json();
      return (json.results || []) as CatalogItem[];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Services & Schemes</h2>
        <button type="button" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {loadingCatalog ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {catalog?.map((item) => (
                <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4 capitalize">{item.type}</td>
                  <td className="px-6 py-4">{item.department}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button type="button" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors" aria-label={`Edit ${item.title}`}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors" aria-label={`Delete ${item.title}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {catalog?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No items found in the catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}