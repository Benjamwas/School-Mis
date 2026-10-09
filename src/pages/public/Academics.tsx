import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Button, SectionTitle } from '../../components/ui/primitives';
import { IMAGES, PROGRAMS } from '../../data/school';
import { PageHero } from './PageHero';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

const OUTCOMES = [
  'Reads fluently and for meaning by the end of Grade 3',
  'Applies number, measurement and geometry to real problems',
  'Investigates scientifically and records findings clearly',
  'Communicates confidently in English and Kiswahili',
  'Uses digital tools safely and purposefully',
  'Works in a team and leads when asked to'
];

export function Academics() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Academics"
        title="A Competency-Based Curriculum, Delivered Properly"
        intro="Structured literacy and numeracy every morning, specialist subject teaching from Grade 4, and assessment that tells you what your child can actually do."
        image={IMAGES.classroom}
        primaryCta="View All Programmes"
        primaryTo="/programmes"
        secondaryCta="Book a Visit"
        secondaryTo="/admissions"
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Academic levels"
            title="Choose a section to explore"
            intro="From Playgroup through Junior Secondary — every stage builds on the last."
          />

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROGRAMS.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-3xl p-5 hover-lift group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={(IMAGES as any)[p.image]}
                    alt={p.name}
                    className="h-20 w-20 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <p className="text-[11px] font-semibold text-gold uppercase tracking-wider">{p.stage}</p>
                    <h3 className="font-heading text-[16px] font-bold heading-color group-hover:text-gold transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[12px] text-ink-muted dark:text-gray-500">{p.ages}</p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted dark:text-gray-400 line-clamp-2">{p.blurb}</p>
                <Link to="/programmes" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-gold hover:text-gold-dark">
                  View programme <ArrowRightIcon size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="pill mb-3 inline-flex bg-white/10 border-white/20 text-gold"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Learning outcomes</span>
            <h2 className="font-display text-heading-lg text-white leading-[1.15] tracking-[-0.02em]">What a SALA Learner Leaves With</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">By the end of Grade 6, every learner should be able to do the following — and we report against each of them.</p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex gap-3 rounded-card glass p-4">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-[14px] leading-relaxed text-white">{o}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link to="/programmes">
              <Button size="lg" className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow px-8">
                Explore All Programmes
                <ArrowRightIcon size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
