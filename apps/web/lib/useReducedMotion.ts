import { useEffect, useState } from 'react';

/**
 * Returns `true` if the user has opted in to reduced motion via their OS.
 * Use this to skip or shorten Framer Motion animations for accessibility.
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * <motion.div transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }} />
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
