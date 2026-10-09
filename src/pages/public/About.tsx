import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpenIcon, HeartIcon, SparklesIcon } from 'lucide-react';
import { Button, SectionTitle } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { Timeline } from '../../components/ui/data';
import { CAMPUS_STATS, IMAGES, LEADERSHIP, PROGRAMS, TIMELINE, VALUES, SCHOOL } from '../../data/school';
import { PageHero } from './PageHero';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

export function About() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="About the school"
        title="A School Built One Classroom At A Time"
        intro="From nineteen children in a converted family home to 1,148 learners on a six-acre Kiambu Road campus — the same conviction has carried us the whole way."
        image={IMAGES.library}
        primaryCta="Book a Visit"
        primaryTo="/admissions"
        secondaryCta="Our Programmes"
        secondaryTo="/programmes"
      />

      {/* Story */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <BookOpenIcon size={12} className="text-gold" />
                Our Story
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                Founded By A Teacher, Still Run Like A Classroom
              </h2>
            </motion.div>

            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
              <motion.p {...fade}>
                Dr. Ann Lifred Mwangi started SALA in 2002 after fifteen years teaching in public primary
                schools. She had one rule for the new school: no child would be allowed to fall behind
                quietly. Every decision since — small classes, specialist teachers from Grade 4, a
                personalised learning profile for every learner — comes back to that rule.
              </motion.p>
              <motion.p {...fade}>
                Today SALA educates children from Playgroup through Grade 9 across three sections, with
                an academic team of 86. We are fully aligned to the competency-based curriculum and
                report on it honestly: parents see the topics their child has mastered and the ones
                needing work, in the same view.
              </motion.p>
              <motion.p {...fade}>
                Our motto — <span className="font-semibold text-ink dark:text-white">{SCHOOL.motto}</span> —
                is not just words. It is the lived reality of every teacher, parent and child who walks
                through our gates.
              </motion.p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              <motion.div {...fade} whileHover={{ y: -4 }} className="glass-card rounded-3xl p-6 hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-11 w-11 rounded-2xl bg-gold/20 grid place-items-center">
                    <SparklesIcon size={18} className="text-gold" />
                  </span>
                  <h3 className="font-heading text-[18px] font-bold heading-color">Our Vision</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                  To be Kenya&apos;s most trusted school — where academic excellence and personal character
                  are pursued with equal seriousness.
                </p>
              </motion.div>
              <motion.div {...fade} whileHover={{ y: -4 }} className="glass-card rounded-3xl p-6 hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-11 w-11 rounded-2xl bg-gold/20 grid place-items-center">
                    <HeartIcon size={18} className="text-gold" />
                  </span>
                  <h3 className="font-heading text-[18px] font-bold heading-color">Our Mission</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                  To provide every learner with a safe, joyful and rigorous education, delivered by
                  excellent teachers in genuine partnership with families.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div {...fade} className="relative overflow-hidden rounded-3xl">
              <img src={IMAGES.classroom} alt="A lesson in progress" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
              <div className="absolute bottom-4 left-4 glass rounded-full px-4 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Every seat is a good one
              </div>
            </motion.div>

            <motion.div {...fade} className="rounded-3xl bg-navy-deep p-6 text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
              <h3 className="font-heading text-[16px] font-bold text-white relative">Educational Philosophy</h3>
              <ul className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-white/75 relative">
                {[
                  ['Mastery before pace.', 'We do not move on because the term does.'],
                  ['Evidence, not impressions.', 'Every judgement about a child is backed by work we can show you.'],
                  ['Warmth with structure.', 'Clear expectations are a form of kindness.'],
                  ['Parents as partners.', 'You should never be surprised by a report card.']
                ].map(([t, b]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                    <span><span className="font-semibold text-white">{t}</span> {b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <FloatingSchoolDecor variant="navy" density="high" seed={ 4 } />
        <div className="absolute top-1/4 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="pill mb-4 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Core Values
            </span>
            <h2 className="font-display text-[32px] sm:text-[42px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Five Things We Will Not Compromise On
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-5 hover-lift"
              >
                <span className="h-11 w-11 rounded-2xl bg-gradient-yellow grid place-items-center shadow-yellow mb-3">
                  <Icon name={v.icon || 'Star'} size={18} className="text-navy-deep" />
                </span>
                <h3 className="font-heading text-[16px] font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline + Leadership */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Our History
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                Milestones
              </h2>
            </motion.div>
            <div className="mt-8">
              <Timeline
                items={TIMELINE.map((t) => ({ title: t.title, meta: t.year, body: t.body, state: 'complete' as const }))}
              />
            </div>
          </div>

          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Leadership
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                The People Accountable For Your Child&apos;s School
              </h2>
            </motion.div>
            <ul className="mt-8 space-y-4">
              {LEADERSHIP.map((l, i) => (
                <motion.li
                  key={l.name}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="glass-card rounded-2xl p-4 hover-lift flex gap-4"
                >
                  <span className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-yellow grid place-items-center font-heading font-bold text-navy-deep">
                    {l.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <p className="font-heading text-[15px] font-bold text-ink dark:text-white">{l.name}</p>
                    <p className="text-[12.5px] text-gold font-semibold">{l.role}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-muted dark:text-gray-400">{l.note}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative py-14 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPUS_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 text-center"
              >
                <p className="font-display font-bold text-3xl sm:text-4xl text-gold tabular-nums">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-medium text-white/60 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes at a glance */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="What we teach"
            title="Programmes from Playgroup to Grade 9"
            intro="Six carefully designed stages — each one building on the last, so no child is rushed and none is left behind."
            center
            tone="light"
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROGRAMS.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-5 hover-lift"
              >
                <p className="text-[12px] font-semibold text-gold uppercase tracking-wider">{p.stage}</p>
                <h3 className="mt-1 font-heading text-[17px] font-bold text-ink dark:text-white">{p.name}</h3>
                <p className="mt-1 text-[12px] text-ink-muted dark:text-gray-500">{p.ages}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted dark:text-gray-400 line-clamp-2">{p.blurb}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/programmes">
              <Button size="lg" className="rounded-full bg-navy-deep text-white hover:bg-navy-soft px-8">
                Explore All Programmes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-soft to-gold" />
        <div className="absolute inset-0 gradient-mesh opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <motion.h2 {...fade} className="font-display text-[28px] sm:text-[36px] leading-tight font-bold text-navy-deep">
              Student Wellbeing & Parent Partnership
            </motion.h2>
            <p className="mt-3 text-[15px] leading-relaxed text-navy-deep/80 max-w-2xl">
              A full-time nurse, two trained counsellors, a no-tolerance bullying policy and a class
              teacher who calls you before small things become large ones. Parents meet teachers
              formally three times a year — and informally whenever they need to.
            </p>
          </div>
          <div className="flex items-end">
            <Link to="/admissions" className="w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" full className="bg-navy-deep text-white hover:bg-navy-800 rounded-full shadow-elevated">
                  Come and See For Yourself
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
