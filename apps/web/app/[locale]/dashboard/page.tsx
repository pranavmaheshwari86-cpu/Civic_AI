'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList, BookOpen,
  ShieldCheck, Bell,
  CheckCircle2,
} from 'lucide-react';
import { m as motion } from "motion/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const QUICK_LINKS = [
  { label: 'Apply for Scheme', href: '/schemes', icon: BookOpen, desc: 'Browse 42+ options', accent: 'text-gray-700' },
  { label: 'Track Complaint', href: '/complaints', icon: ClipboardList, desc: '2 active issues', accent: 'text-gray-700' },
  { label: 'Upload Documents', href: '/documents', icon: ShieldCheck, desc: 'DigiLocker Sync', accent: 'text-gray-700' },
];



import { useRouter } from 'next/navigation';
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
      router.push(`/${locale}`); // Redirect to home if unauthenticated
    }
  }, [accessToken, router, locale]);

  if (!accessToken) {
    return null; // Prevent flashing protected content
  }

  return (
    <div className="px-6 lg:px-12 py-8 max-w-[1400px] mx-auto w-full pb-24 md:pb-8">
      {/* ── Page Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-1">Welcome back. Here&apos;s your civic activity overview.</p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="hidden md:flex gap-xs">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Button>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* ── AI Insights Card ── */}
              <div className="lg:col-span-2">
                <Card className="p-8 relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/20 shadow-premium h-full flex flex-col justify-between rounded-[2rem]">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-bold text-foreground">AI Insights: PM Kisan Samman Nidhi</h2>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-sm px-3 rounded-full">High Match</Badge>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 shadow-sm px-3 rounded-full">Requires 1 Doc</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-8 max-w-xl text-sm leading-relaxed">
                      Based on your recent land record update, you are now eligible for the PM Kisan scheme. 
                      The AI has pre-filled <strong className="text-gray-800 font-bold">80%</strong> of your application using verified digital locker data.
                    </p>
                  </div>
                  
                  <div>
                    <Button className="bg-foreground hover:bg-foreground/90 text-background px-8 py-2 rounded-xl shadow-diffusion active:scale-95 transition-transform duration-200">
                      Review Application
                    </Button>
                  </div>
                </Card>
              </div>

              {/* ── Active Applications Stat ── */}
              <div className="lg:col-span-1">
                <Card className="p-8 bg-card shadow-ambient border-0 h-full flex flex-col justify-between group rounded-[2rem]">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-muted-foreground">Active Applications</h3>
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-foreground tracking-tighter">
                    03
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* ── Quick Actions ── */}
              <div className="lg:col-span-2">
                <h2 className="font-semibold text-gray-800 mb-6 text-lg">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {QUICK_LINKS.map((link, idx) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={p(link.href)} className="block outline-none h-full">
                        <Card className="p-6 h-full flex flex-col bg-card border-0 shadow-ambient hover:shadow-premium transition-shadow duration-300 rounded-3xl">
                          <div className="w-12 h-12 mb-4 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 text-primary">
                            <link.icon className="w-6 h-6" />
                          </div>
                          <div className="mt-auto">
                            <p className="font-semibold text-foreground text-sm mb-1">{link.label}</p>
                            <p className="text-xs text-muted-foreground">{link.desc}</p>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Resolved Issues Stat ── */}
              <div className="lg:col-span-1 pt-[52px]">
                <Card className="p-8 bg-card shadow-ambient border-0 h-full flex flex-col justify-between group rounded-[2rem]">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-muted-foreground">Resolved Issues</h3>
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-foreground tracking-tighter">
                    12
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 mb-6 text-lg">Recent Activity</h2>
              <div className="pl-2">
                <div className="relative border-l-2 border-gray-200 ml-3 pb-8 pl-8">
                  <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Application Approved: Subsidized Solar</p>
                      <p className="text-xs text-gray-500 mt-1">Timestamp at 11:33 PM</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-sm px-3 rounded-full text-xs">Approved</Badge>
                  </div>
                </div>
                
                <div className="relative border-l-2 border-gray-200 ml-3 pb-8 pl-8">
                  <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Document Synced from DigiLocker</p>
                      <p className="text-xs text-gray-500 mt-1">Timestamp at 07:12 AM - Salary Proof_XY... pdf</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative border-l-2 border-transparent ml-3 pl-8">
                  <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Profile Match Update</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
