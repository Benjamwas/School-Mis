import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Education-related emojis */
const EMOJIS = [
  '📚', '📖', '📕', '📗', '📘', '📙', '✏️', '🖊️', '📐',
  '🎒', '🏫', '🧑‍🎓', '🎓', '🧠', '🎵', '⚽', '🎨', '🔬',
  '🌟', '🏆', '🧩', '📱', '🗣️', '🌍', '❤️'
];

function pick(seed: number, n: number) {
  const out: string[] = [];
  let x = seed;
  for (let i = 0; i < n; i++) {
    x = (x * 1664525 + 1013904223) % 4294967296;
    out.push(EMOJIS[x % EMOJIS.length]);
  }
  return out;
}

type Props = {
  show: boolean;
  /** ms to display — default 4500 (4.5s) */
  duration?: number;
};

/**
 * First-visit homepage loader — infinite floating education emojis.
 */
export default function PageLoader({ show, duration = 4500 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(t);
  }, [show, duration]);

  const [items] = useState(() => {
    const base = Date.now() % 100000;
    return pick(base, 16).map((emoji, i) => {
      const r1 = ((base + i * 97) % 100) / 100;
      const r2 = ((base + i * 53) % 100) / 100;
      return {
        id: i,
        emoji,
        left: 6 + r1 * 88,
        top: 10 + r2 * 72,
        size: 20 + ((base + i * 17) % 24),
        delay: (i % 8) * 0.05,
        duration: 1.4 + ((base + i * 31) % 80) / 100
      };
    });
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="first-visit-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-navy-deep"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
          <div className="absolute inset-0 gradient-mesh opacity-40" />

          {/* Infinite floating education emojis */}
          <div className="absolute inset-0">
            {items.map((it) => (
              <motion.span
                key={it.id}
                className="absolute select-none pointer-events-none"
                style={{
                  left: `${it.left}%`,
                  top: `${it.top}%`,
                  fontSize: it.size,
                  lineHeight: 1
                }}
                initial={{ opacity: 0, scale: 0.4, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0.95, 0],
                  scale: [0.4, 1.2, 1, 0.5],
                  y: [0, -20, -10, -32],
                  rotate: [-10, 8, -5, 12]
                }}
                transition={{
                  duration: it.duration,
                  delay: it.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {it.emoji}
              </motion.span>
            ))}
          </div>

          {/* Center brand pulse */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="h-20 w-20 rounded-2xl bg-gradient-yellow grid place-items-center shadow-yellow"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-heading font-bold text-navy-deep text-2xl">SA</span>
            </motion.div>

            <motion.div
              className="flex gap-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {['📚', '🎒', '🎓', '✏️'].map((e, i) => (
                <motion.span
                  key={e}
                  className="text-xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
                >
                  {e}
                </motion.span>
              ))}
            </motion.div>

            <p className="text-[10px] uppercase tracking-[0.22em] text-gold/85 font-semibold">
              Welcome to SALA
            </p>
          </motion.div>

          {/* Infinite emoji marquee */}
          <div className="absolute bottom-0 inset-x-0 h-12 overflow-hidden border-t border-white/10 bg-navy-deep/60 backdrop-blur-sm">
            <div className="flex w-max animate-marquee items-center h-full">
              {[...EMOJIS, ...EMOJIS, ...EMOJIS].map((e, i) => (
                <span key={i} className="px-5 text-xl opacity-85">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
