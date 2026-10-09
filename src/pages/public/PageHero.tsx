import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../../components/ui/primitives';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  primaryCta,
  primaryTo,
  secondaryCta,
  secondaryTo,
  compact = false
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  primaryCta?: string;
  primaryTo?: string;
  secondaryCta?: string;
  secondaryTo?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? 'relative overflow-hidden min-h-[320px] flex items-center bg-gradient-hero'
          : 'relative overflow-hidden min-h-[420px] lg:min-h-[480px] flex items-center bg-gradient-hero'
      }
    >
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover kenburns opacity-45"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/60 via-transparent to-navy-deep/40" />
      <FloatingSchoolDecor variant="navy" density={compact ? 'low' : 'medium'} seed={42} />
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl blob pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" style={{ animationDelay: '-8s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 w-full">
        <div className={compact ? 'max-w-3xl' : 'max-w-3xl'}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/12 backdrop-blur border border-white/20 px-4 py-1.5 text-[11px] font-semibold text-white/85 uppercase tracking-[0.18em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="mt-5 font-display font-bold text-white leading-[1.08] tracking-[-0.02em] text-[2rem] sm:text-5xl lg:text-[3.4rem]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-4 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-white/70"
          >
            {intro}
          </motion.p>

          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {primaryCta && primaryTo && (
                primaryTo.startsWith('http') ? (
                  <a href={primaryTo} target="_blank" rel="noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="rounded-full bg-gold px-7 text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow"
                      >
                        {primaryCta}
                        <ArrowRightIcon size={16} />
                      </Button>
                    </motion.div>
                  </a>
                ) : (
                  <Link to={primaryTo}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="rounded-full bg-gold px-7 text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow"
                      >
                        {primaryCta}
                        <ArrowRightIcon size={16} />
                      </Button>
                    </motion.div>
                  </Link>
                )
              )}
              {secondaryCta && secondaryTo && (
                secondaryTo.startsWith('http') ? (
                  <a href={secondaryTo} target="_blank" rel="noreferrer">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="rounded-full bg-white/10 border-white/25 text-white hover:bg-white/20 backdrop-blur"
                      >
                        {secondaryCta}
                      </Button>
                    </motion.div>
                  </a>
                ) : (
                  <Link to={secondaryTo}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="rounded-full bg-white/10 border-white/25 text-white hover:bg-white/20 backdrop-blur"
                      >
                        {secondaryCta}
                      </Button>
                    </motion.div>
                  </Link>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
