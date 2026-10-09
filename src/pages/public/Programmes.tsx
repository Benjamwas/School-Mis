import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, MusicIcon, SparklesIcon } from 'lucide-react';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { DAY_SCHEDULE, IMAGES, PROGRAMS, SCHOOL, WHATSAPP_URL } from '../../data/school';
import { PageHero } from './PageHero';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

export function Programmes() {
  const [active, setActive] = useState(PROGRAMS[0].slug);
  const [auto, setAuto] = useState(true);
  const program = PROGRAMS.find((p) => p.slug === active) ?? PROGRAMS[0];

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      setActive((cur) => {
        const i = PROGRAMS.findIndex((p) => p.slug === cur);
        return PROGRAMS[(i + 1) % PROGRAMS.length].slug;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Programmes"
        title="A Thoughtful Path For Every Child"
        intro="From first steps in Playgroup to the independence of Junior Secondary — six stages, one continuous journey of learning, character and confidence."
        image={IMAGES.classroom}
        primaryCta="Book a Visit"
        primaryTo="/admissions"
        secondaryCta="Ask on WhatsApp"
        secondaryTo={WHATSAPP_URL(`Hi ${SCHOOL.name}! Please tell me about your programmes.`)}
      />

      {/* Stage overview pills */}
      <section className="relative -mt-6 z-20 sticky top-[72px] sm:top-[80px] bg-surface-light/95 dark:bg-navy-dark/95 backdrop-blur-md border-b border-surface-border dark:border-white/10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {PROGRAMS.map((p) => {
            const on = p.slug === active;
            return (
              <button
                key={p.slug}
                onClick={() => { setActive(p.slug); setAuto(false); }}
                onMouseEnter={() => setAuto(false)}
                className={on
                  ? 'flex-shrink-0 rounded-full bg-navy-deep text-white px-4 py-2 text-[13px] font-semibold transition-all duration-300'
                  : 'flex-shrink-0 rounded-full bg-card border border-surface-border/60 text-ink-muted hover:border-gold/50 hover:text-ink dark:bg-white/5 dark:border-white/10 dark:text-gray-300 px-4 py-2 text-[13px] font-medium transition-all duration-300'
                }
              >
                {p.short}
              </button>
            );
          })}
          <span className="ml-auto hidden md:block text-[11px] text-ink-muted dark:text-gray-500 font-medium whitespace-nowrap pl-4">
            {auto ? 'Auto-advancing · hover to pause' : 'Paused'}
          </span>
        </div>
      </section>

      {/* Detail panel */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={program.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10"
            >
              <div>
                <div className="flex items-start gap-4">
                  <span className="h-16 w-16 rounded-2xl bg-gradient-yellow grid place-items-center shadow-yellow shrink-0">
                    <Icon name={program.icon} size={26} className="text-navy-deep" />
                  </span>
                  <div>
                    <p className="pill">{program.stage}</p>
                    <h2 className="mt-2 font-display text-[30px] sm:text-[38px] font-bold text-ink dark:text-white leading-[1.1] tracking-[-0.02em]">
                      {program.name}
                    </h2>
                    <p className="mt-1 text-[13px] font-semibold text-gold">{program.ages}</p>
                  </div>
                </div>

                <p className="mt-6 text-[15.5px] leading-relaxed text-ink-muted dark:text-gray-400">
                  {program.blurb}
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                  <Card className="p-5 glass-card">
                    <h3 className="text-[14px] font-heading font-semibold text-ink dark:text-white mb-2">Teaching approach</h3>
                    <p className="text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{program.approach}</p>
                  </Card>
                  <Card className="p-5 glass-card">
                    <h3 className="text-[14px] font-heading font-semibold text-ink dark:text-white mb-3">What makes it special</h3>
                    <ul className="space-y-2">
                      {program.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-[13px] text-ink-muted dark:text-gray-400">
                          <CheckIcon size={15} className="mt-0.5 shrink-0 text-gold" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  <Card className="p-5">
                    <h3 className="text-[14px] font-heading font-semibold text-ink dark:text-white mb-3">Subjects &amp; learning areas</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {program.subjects.map((s) => (
                        <li key={s} className="rounded-full border border-surface-border dark:border-white/15 bg-surface-light dark:bg-white/5 px-2.5 py-1 text-[12px] text-ink-muted dark:text-gray-400">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-5">
                    <h3 className="text-[14px] font-heading font-semibold text-ink dark:text-white mb-3">Co-curricular</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {program.activities.map((s) => (
                        <li key={s} className="rounded-full border border-surface-border dark:border-white/15 bg-surface-light dark:bg-white/5 px-2.5 py-1 text-[12px] text-ink-muted dark:text-gray-400">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/admissions">
                    <Button size="lg" className="rounded-full bg-navy-deep text-white hover:bg-navy-soft">
                      Apply for {program.short}
                      <ArrowRightIcon size={16} />
                    </Button>
                  </Link>
                  <a
                    href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I am interested in ${program.name} (${program.ages}).`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="lg" variant="secondary" className="rounded-full">
                      Ask about {program.short}
                    </Button>
                  </a>
                </div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-3xl overflow-hidden shadow-elevated"
                >
                  <img src={(IMAGES as any)[program.image]} alt={program.name} className="w-full aspect-[4/3] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-heading font-bold text-white text-lg">{program.name}</p>
                    <p className="text-[12px] text-white/70 mt-0.5">{program.ages}</p>
                  </div>
                </motion.div>

                <Card className="mt-6 p-5 glass-card">
                  <h3 className="text-[15px] font-heading font-semibold text-ink dark:text-white flex items-center gap-2">
                    <SparklesIcon size={16} className="text-gold" /> Learning outcomes
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      'Reads fluently and for meaning by the end of Grade 3',
                      'Applies number, measurement and geometry to real problems',
                      'Communicates confidently in English and Kiswahili',
                      'Works in a team and leads when asked to',
                      'Uses digital tools safely and purposefully'
                    ].map((o) => (
                      <li key={o} className="flex gap-2 text-[13px] text-ink-muted dark:text-gray-400">
                        <CheckIcon size={14} className="mt-0.5 shrink-0 text-gold" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </Card>

                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-navy-deep/[0.04] dark:bg-white/5 px-4 py-3">
                  <MusicIcon size={16} className="text-gold shrink-0" />
                  <p className="text-[13px] font-medium text-navy-deep dark:text-foreground/90">
                    Music specialist from PP1 · Swimming from PP1 · French foundations in upper primary
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {PROGRAMS.map((p) => (
              <button
                key={p.slug}
                onClick={() => { setActive(p.slug); setAuto(false); }}
                aria-label={p.name}
                className={
                  p.slug === active
                    ? 'h-2 w-8 rounded-full bg-gold transition-all duration-300'
                    : 'h-2 w-2 rounded-full bg-navy-deep/25 dark:bg-white/20 hover:bg-gold/50 transition-all duration-300'
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* All programmes grid */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <FloatingSchoolDecor variant="navy" density="high" seed={ 6 } />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="The full journey"
            title="Six stages. One continuous path."
            intro="Each stage is designed to hand the next one a child who is ready — curious, confident and kind."
            center
            tone="dark"
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROGRAMS.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                onClick={() => { setActive(p.slug); setAuto(false); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                className="glass rounded-3xl p-6 hover-lift cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="h-12 w-12 rounded-2xl bg-gradient-yellow grid place-items-center shadow-yellow">
                    <Icon name={p.icon} size={20} className="text-navy-deep" />
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-gold">{p.stage}</span>
                </div>
                <h3 className="font-heading font-bold text-white text-lg group-hover:text-gold transition-colors">{p.name}</h3>
                <p className="mt-1 text-[12px] text-white/55">{p.ages}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/70 line-clamp-2">{p.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Day schedule teaser */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                The school day
              </span>
              <h2 className="font-display text-[30px] sm:text-[38px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                Structure that sets children free
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
                A predictable rhythm — assembly, core learning, play, lunch, clubs — so children know
                what comes next and feel safe enough to explore.
              </p>
              <Link to="/campus" className="mt-6 inline-block">
                <Button className="rounded-full bg-navy-deep text-white hover:bg-navy-soft">
                  See the Campus
                  <ArrowRightIcon size={15} />
                </Button>
              </Link>
            </motion.div>
          </div>
          <ul className="space-y-2.5">
            {DAY_SCHEDULE.map((d, i) => (
              <motion.li
                key={d.time}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-2xl glass-card p-3.5 hover:border-gold/40 transition-colors"
              >
                <span className="font-mono text-[12.5px] font-semibold text-gold shrink-0 w-18 pt-0.5">{d.time}</span>
                <div>
                  <p className="font-heading text-[14px] font-bold text-ink dark:text-white">{d.title}</p>
                  <p className="text-[12.5px] text-ink-muted dark:text-gray-400 mt-0.5">{d.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
