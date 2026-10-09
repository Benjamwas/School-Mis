import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  BriefcaseIcon,
  CalculatorIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  LanguagesIcon,
  MusicIcon,
  PaletteIcon,
  SchoolIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UserRoundIcon,
  UsersIcon
} from 'lucide-react';

type IconCmp = typeof BookOpenIcon;

const ICONS: IconCmp[] = [
  BookOpenIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  SchoolIcon,
  UsersIcon,
  UserRoundIcon,
  MusicIcon,
  PaletteIcon,
  CalculatorIcon,
  GlobeIcon,
  LanguagesIcon,
  TrophyIcon,
  TargetIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon
];

/** School-vibe labels paired with icons */
const CAREERS = ['Doctor', 'Engineer', 'Teacher', 'Pilot', 'Artist', 'Nurse', 'Coder', 'Lawyer'];

function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Props = {
  density?: 'low' | 'medium' | 'high';
  seed?: number;
  variant?: 'navy' | 'gold' | 'soft';
};

/**
 * Floating books, minds, desks, students and career chips.
 * Purely decorative — parent suspends this via React.lazy.
 */
export default function FloatingIcons({ density = 'medium', seed = 0, variant = 'navy' }: Props) {
  const count = density === 'low' ? 8 : density === 'high' ? 18 : 12;
  const rand = mulberry32(seed * 9973 + density.length * 31 + 7);

  const items = Array.from({ length: count }, (_, i) => {
    const kind = i % 5;
    const Icon = ICONS[i % ICONS.length];
    const left = 3 + rand() * 92;
    const top = 4 + rand() * 88;
    const size = 16 + Math.floor(rand() * 22);
    const delay = rand() * 4;
    const duration = 6 + rand() * 7;
    const xDrift = (rand() - 0.5) * 40;
    const yDrift = 18 + rand() * 36;
    const rotate = (rand() - 0.5) * 24;

    return {
      id: `${seed}-${i}`,
      kind,
      Icon,
      left,
      top,
      size,
      delay,
      duration,
      xDrift,
      yDrift,
      rotate,
      career: CAREERS[i % CAREERS.length]
    };
  });

  const stroke =
    variant === 'gold' ? 'text-navy-deep/70' : 'text-white/80';

  return (
    <>
      {items.map((it) => {
        const base = {
          left: `${it.left}%`,
          top: `${it.top}%`
        } as const;

        const anim = {
          y: [0, -it.yDrift, 0],
          x: [0, it.xDrift, 0],
          rotate: [0, it.rotate, 0],
          opacity: [0.35, 0.95, 0.35]
        };

        const transition = {
          duration: it.duration,
          delay: it.delay,
          repeat: Infinity,
          ease: 'easeInOut' as const
        };

        // 0–3: floating icons · 4: career chip · 5: desk/students glyph cluster
        if (it.kind === 4) {
          return (
            <motion.div
              key={it.id}
              style={base}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={anim}
              transition={transition}
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-current/20 bg-current/5 px-2.5 py-1 backdrop-blur-[2px] ${stroke}`}
              >
                <BriefcaseIcon size={11} className="opacity-80" />
                <span className="text-[9px] font-semibold tracking-wider uppercase">{it.career}</span>
              </span>
            </motion.div>
          );
        }

        if (it.kind === 5) {
          // "Desk + students" mini cluster
          return (
            <motion.div
              key={it.id}
              style={base}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={anim}
              transition={transition}
            >
              <div className={`flex items-end gap-1 ${stroke}`}>
                <UsersIcon size={it.size * 0.7} className="opacity-80" />
                <div className="flex flex-col gap-0.5 pb-0.5">
                  <span className="block h-[3px] w-7 rounded bg-current opacity-70" />
                  <span className="block h-[3px] w-5 rounded bg-current opacity-50" />
                </div>
              </div>
            </motion.div>
          );
        }

        // Floating icons: book / mind / graduation / school / heart / trophy…
        return (
          <motion.div
            key={it.id}
            style={base}
            className="absolute"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ ...anim, scale: [0.85, 1.1, 0.85] }}
            transition={transition}
          >
            <it.Icon size={it.size} className={`${stroke} drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]`} />
          </motion.div>
        );
      })}
    </>
  );
}
