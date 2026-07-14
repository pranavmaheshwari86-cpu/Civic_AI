'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const p = (path: string) => `/${locale}${path}`;
  const accessToken = useAppStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      router.push(`/${locale}`);
    }
  }, [accessToken, router, locale]);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="pb-xl px-gutter min-h-screen pt-sm">
      <div className="max-w-container-max mx-auto grid grid-cols-12 gap-md">
        {/* Welcome Header */}
        <header className="col-span-12 mb-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-sm">
          <div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">Welcome back, Rohan</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Here is your digital sovereign overview for today.</p>
          </div>
          <div className="text-right">
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Citizen ID</p>
            <p className="font-body-md text-body-md font-medium text-on-surface">CIV-8492-IN</p>
          </div>
        </header>

        {/* AI Insights Card (Full Width) */}
        <section className="col-span-12">
          <div className="ai-gradient-border rounded-xl p-md flex flex-col md:flex-row items-start md:items-center justify-between gap-md ai-glow transition-all hover:scale-[1.005]">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-md text-body-lg font-semibold text-primary mb-2">AI Insights: PM Kisan Samman Nidhi</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-3 max-w-2xl">Based on your recent land record update, you are now eligible for the PM Kisan scheme. The AI has pre-filled 80% of your application using verified digital locker data.</p>
                <div className="flex gap-2">
                  <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">High Match</span>
                  <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">Requires 1 Doc</span>
                </div>
              </div>
            </div>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shrink-0 flex items-center gap-2">
              Review Application
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Quick Actions (Grid of 3) */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 mt-sm">
          <h2 className="font-headline-md text-body-lg font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
            <Link className="depth-1 bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center text-center hover:depth-2 transition-all hover:-translate-y-1 group" href={p("/schemes")}>
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-3 group-hover:bg-secondary-fixed/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
              </div>
              <h4 className="font-label-md text-label-md text-on-surface mb-1">Apply for Scheme</h4>
              <p className="font-body-md text-label-sm text-outline">Browse 42+ options</p>
            </Link>
            <Link className="depth-1 bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center text-center hover:depth-2 transition-all hover:-translate-y-1 group" href={p("/complaints")}>
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-3 group-hover:bg-secondary-fixed/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">track_changes</span>
              </div>
              <h4 className="font-label-md text-label-md text-on-surface mb-1">Track Complaint</h4>
              <p className="font-body-md text-label-sm text-outline">2 active issues</p>
            </Link>
            <Link className="depth-1 bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center text-center hover:depth-2 transition-all hover:-translate-y-1 group" href={p("/documents")}>
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-3 group-hover:bg-secondary-fixed/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
              </div>
              <h4 className="font-label-md text-label-md text-on-surface mb-1">Upload Documents</h4>
              <p className="font-body-md text-label-sm text-outline">DigiLocker Sync</p>
            </Link>
          </div>
        </section>

        {/* Statistics (Side Column on Desktop) */}
        <section className="col-span-12 md:col-span-4 lg:col-span-3 mt-sm">
          <h2 className="font-headline-md text-body-lg font-semibold text-primary mb-4 md:opacity-0 hidden md:block">Stats</h2>
          <div className="flex flex-col gap-sm">
            <div className="depth-1 bg-surface-container-lowest rounded-xl p-sm flex items-center justify-between border-l-4 border-secondary">
              <div>
                <p className="font-label-sm text-label-sm text-outline uppercase">Active Applications</p>
                <p className="font-display-lg text-headline-lg font-bold text-primary">03</p>
              </div>
              <span className="material-symbols-outlined text-outline text-3xl opacity-50">pending_actions</span>
            </div>
            <div className="depth-1 bg-surface-container-lowest rounded-xl p-sm flex items-center justify-between border-l-4 border-tertiary-container">
              <div>
                <p className="font-label-sm text-label-sm text-outline uppercase">Resolved Issues</p>
                <p className="font-display-lg text-headline-lg font-bold text-primary">12</p>
              </div>
              <span className="material-symbols-outlined text-outline text-3xl opacity-50">done_all</span>
            </div>
          </div>
        </section>

        {/* Recent Activity Timeline */}
        <section className="col-span-12 mt-lg">
          <h2 className="font-headline-md text-body-lg font-semibold text-primary mb-6">Recent Activity</h2>
          <div className="depth-1 bg-surface-container-lowest rounded-xl p-md">
            <div className="relative border-l-2 border-surface-variant ml-4 space-y-8 pb-4">
              {/* Timeline Item 1 */}
              <div className="relative pl-8">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h4 className="font-label-md text-label-md font-semibold text-on-surface">Application Approved: Subsidized Solar</h4>
                  <span className="font-label-sm text-label-sm text-outline">Today, 10:42 AM</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-2">Your application under the PM Surya Ghar scheme has been verified and approved by the district nodal officer.</p>
                <span className="inline-block px-2 py-1 bg-[#e6f4ea] text-[#1e8e3e] font-label-sm text-label-sm rounded-full">Approved</span>
              </div>
              {/* Timeline Item 2 */}
              <div className="relative pl-8">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-surface-variant ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h4 className="font-label-md text-label-md font-medium text-on-surface">Document Synced from DigiLocker</h4>
                  <span className="font-label-sm text-label-sm text-outline">Yesterday, 04:15 PM</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">Aadhaar Card successfully synchronized and verified.</p>
              </div>
              {/* Timeline Item 3 */}
              <div className="relative pl-8">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-surface-variant ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h4 className="font-label-md text-label-md font-medium text-on-surface">Grievance Registered: Civic Maintenance</h4>
                  <span className="font-label-sm text-label-sm text-outline">Oct 12, 2024</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-2">Complaint regarding streetlight malfunction in Sector 4 assigned to local municipality.</p>
                <span className="inline-block px-2 py-1 bg-[#fff8e1] text-[#f57f17] font-label-sm text-label-sm rounded-full">In Progress</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* AI Assistant Floating Bubble (Optional, can be globally placed or just here) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href={p("/chat")} className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center hover:scale-110 transition-transform ai-glow group relative">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform duration-300">smart_toy</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
