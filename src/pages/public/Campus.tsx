import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckIcon, MapPinIcon, MessageCircleIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import {
  CAMPUS_FACILITIES,
  CAMPUS_SAFETY,
  CAMPUS_STATS,
  DAY_SCHEDULE,
  IMAGES,
  SCHOOL,
  WHATSAPP_URL
} from '../../data/school';
import { PageHero } from './PageHero';
import { SchoolMap } from '../../components/public/SchoolMap';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

export function Campus() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Our campus"
        title="Every Room, Corner And Outdoor Space, Purposefully Designed"
        intro="A gated six-acre campus on Kiambu Road — bright classrooms, the Baobab Library, a music studio, sports grounds and spaces that keep children safe while they explore."
        image={IMAGES.hero}
        primaryCta="Book a Campus Tour"
        primaryTo="/admissions"
        secondaryCta="Browse Gallery"
        secondaryTo="/gallery"
      />

      {/* Stats */}
      <section className="relative -mt-10 z-10 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CAMPUS_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 text-center hover-lift"
              >
                <p className="font-display font-bold text-3xl text-gradient">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Facilities"
            title="Spaces That Inspire Learning"
            intro="Bright, well-ventilated and fully equipped — every corner of the campus is designed for curiosity, safety and joy."
            tone="light"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_FACILITIES.map((f, i) => (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl overflow-hidden hover-lift group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={(IMAGES as any)[f.image]}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
                  <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                    {f.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-10 w-10 rounded-xl bg-gradient-yellow grid place-items-center shadow-yellow">
                      <Icon name={f.icon} size={18} className="text-navy-deep" />
                    </span>
                    <h3 className="font-heading text-[17px] font-bold text-ink dark:text-white">{f.title}</h3>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{f.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Day schedule */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-35" />
        <FloatingSchoolDecor variant="navy" density="medium" seed={ 7 } />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
          <motion.div {...fade}>
            <span className="pill mb-4 inline-flex">
              <SparklesIcon size={12} className="text-gold" />
              A day on campus
            </span>
            <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              From gates open to the last pickup
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              A predictable rhythm children can trust — with time for serious learning, real play and
              everything in between.
            </p>
            <div className="mt-8 relative rounded-3xl overflow-hidden shadow-elevated">
              <img src={IMAGES.sports} alt="Campus sports field" className="w-full aspect-[16/10] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent" />
              <p className="absolute bottom-4 left-4 font-heading font-bold text-white">Full-size field &amp; courts</p>
            </div>
          </motion.div>

          <ul className="space-y-3">
            {DAY_SCHEDULE.map((d, i) => (
              <motion.li
                key={d.time}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 rounded-2xl bg-white/5 border border-white/8 p-4 hover:border-gold/40 hover:bg-white/8 transition-colors duration-300"
              >
                <span className="font-mono text-[13px] font-semibold text-gold shrink-0 w-20 pt-0.5">{d.time}</span>
                <div>
                  <p className="font-heading text-[15px] font-bold text-white">{d.title}</p>
                  <p className="mt-1 text-[13px] text-white/60 leading-relaxed">{d.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safety */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <ShieldCheckIcon size={12} className="text-gold" />
                Safety &amp; care
              </span>
              <h2 className="font-display text-[30px] sm:text-[40px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                A campus parents can trust
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
                Security, health and wellbeing are not add-ons at SALA — they are how the school day
                is built. You always know where your child is.
              </p>
            </motion.div>

            <ul className="mt-8 space-y-3">
              {CAMPUS_SAFETY.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-3 glass-card rounded-2xl p-4"
                >
                  <span className="h-8 w-8 shrink-0 rounded-full bg-gold/15 text-gold grid place-items-center">
                    <CheckIcon size={15} />
                  </span>
                  <span className="text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{s}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div {...fade} className="space-y-6">
            <Card className="p-0 overflow-hidden glass-card">
              <SchoolMap />
            </Card>
            <Card className="p-6 glass-card">
              <h3 className="font-heading text-[16px] font-bold text-ink dark:text-white flex items-center gap-2">
                <MapPinIcon size={17} className="text-gold" /> Finding the campus
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                {SCHOOL.address}. Visitor parking is available at the main gate — all visitors sign in
                at reception.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/admissions">
                  <Button className="rounded-full bg-navy-deep text-white hover:bg-navy-soft">
                    Book a Tour
                  </Button>
                </Link>
                <a
                  href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to visit the campus.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" className="rounded-full">
                    <MessageCircleIcon size={15} className="text-accent-whatsapp" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden section-on-navy">
        <div className="absolute inset-0 bg-gradient-hero" />
        <FloatingSchoolDecor variant="navy" density="medium" seed={8} />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="absolute -top-16 right-[15%] h-64 w-64 rounded-full bg-gold/15 blur-3xl blob pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.div {...fade}>
            <span className="pill mb-4 inline-flex bg-white/10 border-white/20 text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Come and see
            </span>
            <h2 className="font-display text-[32px] sm:text-[44px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              A tour tells you more than any photograph
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/70 max-w-2xl mx-auto">
              Visit on a school day and watch an ordinary morning at SALA. Meet the section head, walk
              the corridors and ask everything.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/admissions">
                <Button size="lg" className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow px-8">
                  Book a School Visit
                </Button>
              </Link>
              <Link to="/programmes">
                <Button size="lg" variant="secondary" className="rounded-full bg-white/10 border-white/25 text-white hover:bg-white/15 backdrop-blur px-8">
                  Explore Programmes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
