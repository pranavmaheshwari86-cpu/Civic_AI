const fs = require('fs');

const content = `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2, ClipboardList, BookOpen, MessageSquare,
  BarChart2, ShieldCheck, ArrowRight, Sparkles, Bell,
  TrendingUp, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileNav } from '@/components/shared/MobileNav';
import { m as motion } from "motion/react";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

interface Complaint {
  _id: string;
  trackingId: string;
  category: string;
  status: string;
}

const QUICK_LINKS = [
  { label: 'Report an Issue', href: '/complaints', icon: ClipboardList, desc: 'File a new civic complaint', accent: 'bg-orange-50 text-orange-700' },
  { label: 'Discover Schemes', href: '/schemes', icon: BookOpen, desc: 'Find government benefits', accent: 'bg-green-50 text-green-700' },
  { label: 'Ask AI Assistant', href: '/chat', icon: MessageSquare, desc: 'Get instant answers', accent: 'bg-primary-container text-on-primary-container' },
  { label: 'Admin Panel', href: '/admin', icon: BarChart2, desc: 'Manage & review queue', accent: 'bg-purple-50 text-purple-700' },
];

const STATUS_MAP: Record<string, { label: string; variant: "success" | "secondary" | "default" | "destructive" | "outline" | "ai"; Icon: typeof CheckCircle2 }> = {
  resolved: { label: 'Resolved', variant: 'success', Icon: CheckCircle2 },
  in_progress: { label: 'In Progress', variant: 'secondary', Icon: Clock },
  pending: { label: 'Pending', variant: 'outline', Icon: Clock },
  rejected: { label: 'Rejected', variant: 'destructive', Icon: AlertCircle },
};

const springSnappy = { type: 'spring' as const, stiffness: 340, damping: 28 };

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-md py-4"><div className="h-4 bg-gov-border rounded w-24" /></td>
      <td className="px-md py-4"><div className="h-4 bg-gov-border rounded w-20" /></td>
      <td className="px-md py-4"><div className="h-6 bg-gov-border rounded-full w-16" /></td>
    </tr>
  );
}

function StatCardSkeleton() {
  return <Card className="h-28 bg-gov-surface/50 animate-pulse border-gov-border" />;
}

export default function DashboardPage() {
  const { accessToken } = useAppStore();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const p = (path: string) => \`/\${locale}\${path}\`;

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['user-complaints'],
    queryFn: async () => {
      const res = await fetch(
        \`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/complaints/my\`,
        { headers: accessToken ? { Authorization: \`Bearer \${accessToken}\` } : {} }
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    retry: false,
  });

  const stats = [
    { label: 'My Complaints', value: isLoading ? null : (complaints as Complaint[])?.length ?? 0, icon: ClipboardList, accent: 'text-gov-primary bg-gov-primary/10', href: '/complaints' },
    { label: 'Schemes Found', value: 12, icon: BookOpen, accent: 'text-success bg-success/10', href: '/schemes' },
    { label: 'AI Chats', value: 3, icon: MessageSquare, accent: 'text-ai-indigo bg-ai-indigo/10', href: '/chat' },
    { label: 'Resolved Issues', value: isLoading ? null : (complaints as Complaint[])?.filter((c) => c.status === 'resolved').length ?? 0, icon: ShieldCheck, accent: 'text-success bg-success/10', href: '/complaints' },
  ];

  return (
    <>
      <div className="flex h-screen bg-gov-surface overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto md:ml-72 pt-24">
          <div className="flex-1 px-gutter py-lg max-w-[1280px] mx-auto w-full pb-20 md:pb-0">
            {/* ── Page Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md"
            >
              <div>
                <h1 className="font-display text-h1 md:text-display text-gov-text-main">Dashboard</h1>
                <p className="font-body-lg text-body-lg text-gov-text-muted mt-1">Welcome back. Here&apos;s your civic activity overview.</p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="hidden md:flex gap-xs">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Button>
              </motion.div>
            </motion.div>

            {/* ── AI Insights Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
            >
              <Card className="glass-panel p-lg mb-lg relative overflow-hidden shadow-elevation-floating border-ai-indigo/20 bg-ai-surface/40">
                <div className="absolute inset-0 bg-gradient-to-r from-ai-indigo/5 via-ai-violet/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-md">
                  {/* Pulsing AI orb */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(99, 102, 241, 0)',
                        '0 0 22px rgba(99, 102, 241, 0.35)',
                        '0 0 0px rgba(99, 102, 241, 0)',
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-2xl ai-gradient-bg flex items-center justify-center flex-shrink-0"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center gap-xs mb-xs">
                      <span className="font-label text-label text-ai-indigo uppercase tracking-widest">AI Insights</span>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full ai-gradient-bg"
                      />
                    </div>
                    <p className="font-h3 text-h3 text-gov-text-main mb-xs">3 new schemes match your profile</p>
                    <p className="font-body text-body text-gov-text-muted">Based on your location and demographic, you may be eligible for PM Kisan Samman, Ayushman Bharat, and PMAY.</p>
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={springSnappy}>
                    <Button asChild variant="ai">
                      <Link href={p('/schemes')} className="gap-xs">
                        Review Schemes <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
              {isLoading
                ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
                : stats.map((s, idx) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.06, ...springSnappy }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link href={p(s.href)} className="block group outline-none">
                      <Card className="p-md hover:border-gov-primary/30 group-focus-visible:ring-2 group-focus-visible:ring-gov-primary">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-md', s.accent)}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <p className="font-h2 text-h2 text-gov-text-main mb-1">
                          {s.value ?? <Loader2 className="w-5 h-5 animate-spin text-gov-border" />}
                        </p>
                        <p className="font-label text-label text-gov-text-muted group-hover:text-gov-text-main transition-colors">{s.label}</p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* ── Quick Actions ── */}
              <div>
                <h2 className="font-h3 text-h3 text-gov-text-main mb-md flex items-center gap-xs">
                  <TrendingUp className="w-5 h-5 text-gov-primary" />
                  Quick Actions
                </h2>
                <div className="flex flex-col gap-sm">
                  {QUICK_LINKS.map((link, idx) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + idx * 0.06, ease: 'easeOut' }}
                      whileHover={{ x: 4 }}
                    >
                      <Link href={p(link.href)} className="block group outline-none">
                        <Card className="p-md flex items-center gap-md hover:border-gov-primary/30 group-focus-visible:ring-2 group-focus-visible:ring-gov-primary transition-all duration-300">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', link.accent)}>
                            <link.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-label text-label text-gov-text-main group-hover:text-gov-primary transition-colors">{link.label}</p>
                            <p className="font-body text-sm text-gov-text-muted mt-0.5">{link.desc}</p>
                          </div>
                          <motion.div
                            animate={{ x: 0 }}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.15 }}
                          >
                            <ArrowRight className="w-4 h-4 text-gov-border group-hover:text-gov-primary transition-colors" />
                          </motion.div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Recent Complaints ── */}
              <div>
                <h2 className="font-h3 text-h3 text-gov-text-main mb-md flex items-center gap-xs">
                  <ClipboardList className="w-5 h-5 text-gov-primary" />
                  Recent Complaints
                </h2>
                <Card className="overflow-hidden">
                  {isLoading ? (
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gov-border">
                        {Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />)}
                      </tbody>
                    </table>
                  ) : !accessToken ? (
                    <EmptyState
                      icon={<ShieldCheck className="w-8 h-8" />}
                      title="Sign in to view history"
                      description="You need to be signed in to view your complaint history."
                      action={
                        <Button asChild>
                          <Link href={p('/chat')}>Get Started</Link>
                        </Button>
                      }
                      className="border-0 bg-transparent min-h-[300px]"
                    />
                  ) : complaints?.length === 0 ? (
                    <EmptyState
                      icon={<ClipboardList className="w-8 h-8" />}
                      title="No complaints filed yet"
                      action={
                        <Button asChild>
                          <Link href={p('/complaints')}>File First Complaint</Link>
                        </Button>
                      }
                      className="border-0 bg-transparent min-h-[300px]"
                    />
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gov-surface text-gov-text-muted border-b border-gov-border">
                        <tr>
                          <th className="px-md py-sm text-left font-label text-label uppercase tracking-wide">Tracking ID</th>
                          <th className="px-md py-sm text-left font-label text-label uppercase tracking-wide">Category</th>
                          <th className="px-md py-sm text-left font-label text-label uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gov-border">
                        {(complaints as Complaint[])?.slice(0, 5).map((c, rowIdx) => {
                          const s = STATUS_MAP[c.status] ?? { label: c.status, variant: 'default', Icon: Clock };
                          return (
                            <motion.tr
                              key={c._id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + rowIdx * 0.05 }}
                              className="hover:bg-gov-surface/80 transition-colors"
                            >
                              <td className="px-md py-sm font-mono font-label text-label text-gov-text-muted">{c.trackingId}</td>
                              <td className="px-md py-sm font-label text-label capitalize text-gov-text-main">{c.category}</td>
                              <td className="px-md py-sm">
                                <Badge variant={s.variant} className="gap-1">
                                  <s.Icon className="w-3 h-3" />
                                  {s.label}
                                </Badge>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </>
  );
}
`;

fs.writeFileSync('apps/web/app/[locale]/dashboard/page.tsx', content);
console.log('Refactored Dashboard');
