import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MessageCircleIcon,
  QuoteIcon,
  SparklesIcon,
  StarIcon
} from 'lucide-react';
import { Button, Card } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import {
  DAY_SCHEDULE,
  EVENTS,
  HIGHLIGHTS,
  IMAGES,
  MARQUEE_ITEMS,
  NEWS,
  PROGRAMS,
  SCHOOL,
  SCHOOL_LIFE,
  TESTIMONIALS,
  WHY_SALA,
  WHATSAPP_URL
} from '../../data/school';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

const stagger = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' }
};

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative bg-navy-deep section-on-navy overflow-hidden py-3.5 border-y border-white/8">
      <div className="flex w-max animate-marquee">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3.5 text-[10.5px] uppercase tracking-[0.24em] text-white/55 font-semibold pr-10 flex-shrink-0"
          >
            <span className="h-[3px] w-[3px] rounded-full bg-gold/60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[680px] lg:min-h-[780px] flex items-end overflow-hidden bg-navy-deep section-on-navy">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat kenburns"
          style={{ backgroundImage: `url(${IMAGES.hero})`, scale }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-navy-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/55 via-transparent to-transparent" />
        <div className="absolute inset-0 gradient-mesh opacity-35" />
        <FloatingSchoolDecor variant="navy" density="medium" seed={0} />

        {/* Floating blobs */}
        <div className="absolute top-20 right-[10%] h-64 w-64 rounded-full bg-gold/15 blur-3xl blob pointer-events-none" />
        <div className="absolute bottom-32 left-[5%] h-48 w-48 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" style={{ animationDelay: '-6s' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-36 sm:pt-40 lg:pt-44 lg:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
            >
              <SparklesIcon size={14} className="text-gold" />
              <span className="text-[11px] font-semibold text-white/85 uppercase tracking-[0.16em]">
                Playgroup · PP1 · PP2 · Grade 1 – 9
              </span>
            </motion.div>

            <h1 className="font-display font-bold text-white leading-[1.06] tracking-[-0.02em] text-[2.1rem] sm:text-5xl lg:text-[3.6rem]">
              Shaping Confident Learners{' '}
              <span className="text-gradient-yellow">For A Global Future</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-5 text-[16px] sm:text-[19px] text-white/70 font-medium max-w-2xl leading-relaxed"
            >
              St. Ann Lifred Academy Schools — a warm, rigorous Nairobi school where every child
              learns, grows and leads. From first steps in Playgroup to Junior Secondary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/admissions">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full bg-gold px-8 text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow">
                    Book a School Visit
                    <ArrowRightIcon size={16} />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/programmes">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="secondary" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur">
                    Explore Programmes
                  </Button>
                </motion.div>
              </Link>
              <a
                href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to know more about admissions.`)}
                target="_blank"
                rel="noreferrer"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="ghost" className="rounded-full text-white/85 hover:bg-white/10 hover:text-white">
                    <MessageCircleIcon size={16} className="text-accent-whatsapp" />
                    WhatsApp Us
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className="glass-card rounded-2xl p-4 sm:p-5 text-center hover-lift"
              >
                <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-navy-deep dark:text-gold">{h.value}</span>
                <p className="mt-1.5 text-[11px] sm:text-[12px] font-medium leading-snug text-ink dark:text-white/70">{h.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-white/25 flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <Marquee />

      {/* Discover */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fade}>
              <span className="pill mb-4">
                <SparklesIcon size={12} className="text-gold" />
                Discover Our School
              </span>
              <h2 className="font-display text-heading-xl heading-color leading-[1.1] tracking-[-0.02em]">
                A Legacy of{' '}
                <span className="text-gradient">Educational Excellence</span>
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-ink-muted dark:text-gray-400">
                St. Ann Lifred Academy Schools is more than classrooms and corridors — it is a place
                where sparks are lit, characters take shape, and friendships begin. Here, every
                student&apos;s story matters.
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-muted dark:text-gray-400">
                We believe in holistic education — one that balances academic excellence with character
                development, creativity, global awareness and compassion. Powered by our motto:{' '}
                <span className="font-semibold text-ink dark:text-white">Learn. Grow. Lead.</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/about">
                  <Button className="rounded-full bg-navy-deep text-white hover:bg-navy-soft px-6">
                    Our Story
                    <ArrowRightIcon size={15} />
                  </Button>
                </Link>
                <Link to="/campus">
                  <Button variant="secondary" className="rounded-full px-6">
                    Tour the Campus
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: 'GraduationCap', title: 'CBC-aligned learning', body: 'Competency-based delivery from Playgroup through Grade 9.' },
                  { icon: 'Heart', title: 'Known by name', body: 'Small classes and personalised learning profiles for every child.' }
                ].map((c, i) => (
                  <motion.div key={c.title} {...fade} transition={{ delay: 0.1 + i * 0.1 }} whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5 hover-lift">
                    <span className="h-11 w-11 rounded-xl bg-gold/20 grid place-items-center mb-3">
                      <Icon name={c.icon} size={20} className="text-gold" />
                    </span>
                    <h3 className="font-heading text-[15px] font-bold heading-color">{c.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{c.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fade} className="relative">
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  src={IMAGES.classroom}
                  alt="Students learning at SALA"
                  className="w-full aspect-[4/3] object-cover rounded-3xl shadow-elevated"
                />
                <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-card p-5 rounded-2xl shadow-pop max-w-[280px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-8 w-8 rounded-lg bg-gradient-yellow grid place-items-center">
                      <StarIcon size={14} className="text-navy-deep" />
                    </span>
                    <h4 className="font-heading text-[14px] font-bold heading-color">The Difference</h4>
                  </div>
                  <p className="text-[12.5px] text-ink-muted dark:text-gray-400 leading-relaxed">
                    Individualised learning, critical thinking and 21st-century skills — delivered with warmth.
                  </p>
                </div>
                <div className="absolute -top-4 -right-4 glass-gold rounded-2xl px-4 py-3 text-navy-deep shadow-yellow">
                  <p className="font-display font-extrabold text-2xl leading-none">24</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Years of excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why SALA */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <FloatingSchoolDecor variant="navy" density="high" seed={ 1 } />
        <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="pill mb-4 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Why Choose Us
            </span>
            <h2 className="font-display text-heading-xl text-white leading-[1.1] tracking-[-0.02em]">
              An Education Built Around <span className="text-gradient-yellow">The Child</span>
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/60 max-w-2xl mx-auto">
              Nine years of CBC delivery, refined into a school day that is calm, structured and unmistakably warm.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_SALA.map((w, i) => (
              <motion.div
                key={w.title}
                {...stagger}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-card rounded-3xl p-6 hover-lift group"
              >
                <div className="flex items-start gap-4">
                  <span className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-yellow grid place-items-center shadow-yellow group-hover:scale-105 transition-transform duration-300">
                    <Icon name={w.icon} size={22} className="text-navy-deep" />
                  </span>
                  <div>
                    <h3 className="font-heading text-[16px] font-bold text-white">{w.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{w.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Academic Programmes
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                From Playgroup to Junior Secondary
              </h2>
            </motion.div>
            <Link to="/programmes" className="text-[14px] font-semibold text-gold hover:text-gold-dark inline-flex items-center gap-2 group">
              View all programmes
              <ArrowUpRightIcon size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p, i) => (
              <motion.div key={p.slug} {...stagger} transition={{ delay: i * 0.08 }}>
                <Card className="overflow-hidden h-full flex flex-col glass-card hover-lift group">
                  <div className="relative overflow-hidden">
                    <img
                      src={(IMAGES as any)[p.image]}
                      alt={p.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 glass rounded-full px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                      {p.stage}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[12px] font-semibold text-gold">{p.ages}</p>
                    <h3 className="mt-1 font-heading text-[18px] font-bold heading-color group-hover:text-gold transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{p.blurb}</p>
                    <div className="mt-auto pt-4">
                      <Link to="/programmes">
                        <Button
                          variant="secondary"
                          size="sm"
                          full
                          className="bg-white text-navy-deep border border-navy-deep/25 hover:border-gold hover:bg-gold-50 hover:text-navy-deep dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/15 group-hover:border-gold transition-all duration-300 font-semibold"
                        >
                          View Programme
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A day at SALA */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <FloatingSchoolDecor variant="navy" density="medium" seed={ 2 } />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
            <motion.div {...fade} className="lg:sticky lg:top-24">
              <span className="pill mb-4 inline-flex">
                <ClockIcon size={12} className="text-gold" />
                A day at SALA
              </span>
              <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Every corner designed for curiosity, safety and joy
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                From the morning assembly to afternoon clubs, the school day is structured so children
                feel secure — and free to explore.
              </p>
              <Link to="/campus" className="mt-6 inline-block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow">
                    Explore Campus
                  </Button>
                </motion.div>
              </Link>
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
        </div>
      </section>

      {/* School life */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                School Life
              </span>
              <h2 className="font-display text-[32px] sm:text-[40px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                The Hours That Shape A Childhood
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
                Thirty-one clubs, four houses, two terms of inter-school sport and a calendar that
                gives every child something to be known for.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/school-life">
                  <Button className="rounded-full">See School Life</Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="secondary" className="rounded-full">
                    Browse Gallery
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {SCHOOL_LIFE.slice(0, 4).map((s, i) => (
                <motion.figure key={s.title} {...stagger} transition={{ delay: i * 0.08 }} className="group">
                  <div className="relative overflow-hidden rounded-3xl">
                    <img
                      src={(IMAGES as any)[s.image]}
                      alt={s.title}
                      className="w-full aspect-[5/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <figcaption className="mt-4">
                    <h3 className="font-heading text-[16px] font-bold heading-color group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{s.body}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <FloatingSchoolDecor variant="navy" density="medium" seed={ 3 } />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="pill mb-4 inline-flex">
              <QuoteIcon size={12} className="text-gold" />
              Testimonials
            </span>
            <h2 className="font-display text-[32px] sm:text-[42px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              What Our Families Say
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote key={t.name} {...stagger} transition={{ delay: i * 0.12 }} className="glass rounded-3xl p-7 hover-lift">
                <QuoteIcon size={28} className="text-gold/50" />
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/85 italic">“{t.quote}”</p>
                <footer className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-gradient-yellow grid place-items-center font-heading font-bold text-navy-deep text-sm">
                    {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <span className="block font-heading font-bold text-white text-[14px]">{t.name}</span>
                    <span className="block text-[12px] text-gold mt-0.5">{t.role}</span>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* News & events */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14">
            <div>
              <div className="flex items-end justify-between gap-4">
                <motion.div {...fade}>
                  <span className="pill mb-4 inline-flex">
                    <CalendarDaysIcon size={12} className="text-gold" />
                    Latest News
                  </span>
                  <h2 className="font-display text-[32px] sm:text-[40px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                    News &amp; Announcements
                  </h2>
                </motion.div>
                <Link to="/news" className="text-[14px] font-semibold text-gold hover:text-gold-dark whitespace-nowrap inline-flex items-center gap-1">
                  View All <ArrowUpRightIcon size={14} />
                </Link>
              </div>

              <ul className="mt-8 space-y-4">
                {NEWS.slice(0, 4).map((n, i) => (
                  <motion.li key={n.id} {...stagger} transition={{ delay: i * 0.08 }}>
                    <Link to="/news" className="group block glass-card rounded-2xl p-5 hover-lift">
                      <div className="flex items-center gap-3 text-[12px]">
                        <span className="font-semibold text-gold bg-gold/12 px-3 py-1 rounded-full">{n.category}</span>
                        <span className="text-ink-muted dark:text-gray-500">{n.date}</span>
                      </div>
                      <h3 className="mt-3 font-heading text-[17px] font-bold heading-color group-hover:text-gold transition-colors duration-300">{n.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{n.excerpt}</p>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <motion.div {...fade}>
                <Card className="p-6 glass-card">
                  <h3 className="font-heading text-[17px] font-bold heading-color flex items-center gap-2">
                    <CalendarDaysIcon size={18} className="text-gold" /> Upcoming Events
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {EVENTS.slice(0, 4).map((e, i) => (
                      <motion.li
                        key={e.id}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-3.5 group"
                      >
                        <div className="w-14 shrink-0 rounded-xl bg-gradient-yellow text-center py-2 group-hover:scale-105 transition-transform duration-300 shadow-yellow">
                          <span className="block text-[17px] font-bold text-navy-deep leading-none">{e.date.split(' ')[0]}</span>
                          <span className="block text-[10px] uppercase text-navy-deep/70 mt-0.5 font-semibold">{e.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold heading-color leading-snug group-hover:text-gold transition-colors duration-300">{e.title}</p>
                          <p className="text-[12px] text-ink-muted dark:text-gray-500 mt-0.5">{e.time} · {e.location}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { src: IMAGES.library, alt: 'Baobab Library' },
                  { src: IMAGES.sports, alt: 'Sports field' },
                  { src: IMAGES.arts, alt: 'Arts studio' },
                  { src: IMAGES.classroom, alt: 'Classroom' },
                  { src: IMAGES.hero, alt: 'Campus' },
                  { src: IMAGES.sports, alt: 'Athletics' }
                ].map((g, i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.06 }}
                    src={g.src}
                    alt={g.alt}
                    className="aspect-square w-full object-cover rounded-xl cursor-pointer"
                  />
                ))}
              </div>
              <Link to="/gallery" className="inline-block text-[14px] font-semibold text-gold hover:text-gold-dark">
                Browse Gallery →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-hero text-white px-6 sm:px-12 py-12 lg:py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center relative overflow-hidden shadow-elevated">
            <FloatingSchoolDecor variant="navy" density="low" seed={9} />
            <div className="absolute inset-0 gradient-mesh opacity-40" />
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl blob pointer-events-none" />

            <div className="relative">
              <motion.h2 {...fade} className="font-display text-[28px] sm:text-[40px] leading-tight font-bold tracking-[-0.02em]">
                Join the January 2027 Intake
              </motion.h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70 max-w-xl">
                Applications take about fifteen minutes and are saved as you go. Decisions are released
                within ten working days of assessment — and you can follow every stage in the tracker.
              </p>
              <p className="mt-4 text-[14px] text-white/55">
                Questions? Call {SCHOOL.phone} · {SCHOOL.hours}
              </p>
            </div>

            <div className="relative flex flex-col gap-3">
              <Link to="/admissions">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" full className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow">
                    Book a School Visit
                  </Button>
                </motion.div>
              </Link>
              <Link to="/apply">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="secondary" full className="rounded-full bg-white/10 border-white/25 text-white hover:bg-white/15 backdrop-blur">
                    Start an Application
                  </Button>
                </motion.div>
              </Link>
              <a
                href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to book a school visit.`)}
                target="_blank"
                rel="noreferrer"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="ghost" full className="rounded-full text-white/75 hover:bg-white/10 hover:text-white">
                    <MessageCircleIcon size={16} className="text-accent-whatsapp" />
                    Chat on WhatsApp
                  </Button>
                </motion.div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
