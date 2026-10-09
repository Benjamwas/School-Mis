import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Lazy-loaded floating school icons — mounted only when near the viewport. */
const FloatingIcons = lazy(() => import('./FloatingIcons'));

export type FloatingSchoolDecorProps = {
  /** Which blue/dark section this sits on */
  variant?: 'navy' | 'gold' | 'soft';
  /** Density: low | medium | high */
  density?: 'low' | 'medium' | 'high';
  /** Extra className for positioning */
  className?: string;
  /** Seed so each section gets a unique layout */
  seed?: number;
};

/**
 * Decorative floating books, minds, desks, students and careers.
 * Lazy-loads the icon layer and only animates when on screen.
 */
export function FloatingSchoolDecor({
  variant = 'navy',
  density = 'medium',
  className = '',
  seed = 0
}: FloatingSchoolDecorProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const opacity =
    variant === 'gold' ? 'opacity-[0.14]' : variant === 'soft' ? 'opacity-[0.12]' : 'opacity-[0.18]';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${opacity} ${className}`}
    >
      {near && !reduce && (
        <Suspense fallback={null}>
          <FloatingIcons density={density} seed={seed} variant={variant} />
        </Suspense>
      )}
    </div>
  );
}

/** Convenience wrapper: absolute-positioned decor inside a relative section. */
export function SectionDecor({
  variant = 'navy',
  density = 'medium',
  seed = 0
}: Omit<FloatingSchoolDecorProps, 'className'>) {
  return <FloatingSchoolDecor variant={variant} density={density} seed={seed} />;
}

export function DecorPulse({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}
