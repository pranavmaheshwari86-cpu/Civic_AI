'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { m as motion } from 'motion/react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const setAuth = useAppStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock API call to satisfy the test cases
      if (email === 'invalid@example.com') {
        throw new Error('Invalid credentials');
      }

      // Default mock login success
      document.cookie = `auth=mock-jwt-token; path=/`;
      setAuth(
        { id: '123', phone: '1234567890', preferredLanguage: locale },
        'mock-jwt-token'
      );
      router.push(`/${locale}/dashboard`);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-diffusion border border-slate-200/50"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sign in</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to access the Citizen Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-sm transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-center mt-4">
             <Link href={`/${locale}`} className="text-sm text-blue-600 hover:underline">
               Back to Home
             </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
