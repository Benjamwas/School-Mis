import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarDaysIcon, PlayCircleIcon, QuoteIcon, StarIcon } from 'lucide-react';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { EVENTS, GALLERY, HIGHLIGHTS, IMAGES, NEWS, PROGRAMS, SCHOOL, SCHOOL_LIFE, TESTIMONIALS, WHY_SALA } from '../../data/school';

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as const }
};

export function Home() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-forest-900 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-medium text-gold-300">
              <StarIcon size={14} /> Admissions open for January 2027
            </p>
            <h1 className="mt-4 font-serif text-[40px] leading-[1.06] sm:text-[54px] lg:text-[62px]">Where Every Child Learns, Grows and Leads.</h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-forest-100/90">
              St. Ann Lifred Academy is a Nairobi private school for ECD through Grade 6, where small classes, specialist teachers and an honest
              partnership with parents help every child find what they are good at — and work at what they are not.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply">
                <Button size="lg" variant="gold" icon={<ArrowRightIcon size={17} />}>
                  Apply for admission
                </Button>
              </Link>
              <Link to="/visit">
                <Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/25 hover:bg-white/15 hover:border-white/40">
                  Book a school visit
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 border-t border-white/15 pt-7">
              {HIGHLIGHTS.map((h) =>
              <div key={h.label}>
                  <dt className="font-serif text-[28px] text-gold-300">{h.value}</dt>
                  <dd className="text-[12.5px] leading-snug text-forest-100/80 mt-1">{h.label}</dd>
                </div>
              )}
            </dl>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="relative">
            <img src={IMAGES.hero} alt="Learners walking through the SALA campus courtyard" className="w-full aspect-[4/3] object-cover rounded-card" />
            <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3.5 py-2 text-[13px] font-medium text-ink hover:bg-white transition-colors duration-150">
              <PlayCircleIcon size={17} className="text-forest-700" /> Watch a day at SALA · 2:40
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why SALA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <motion.div {...fade}>
          <SectionTitle eyebrow="Why families choose SALA" title="An education built around the child in front of us" intro="Nine years of CBC delivery, refined into a school day that is calm, structured and unmistakably warm." />
        </motion.div>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_SALA.map((w) =>
          <motion.div key={w.title} {...fade} className="flex gap-4">
              <span className="h-10 w-10 shrink-0 rounded-lg bg-forest-50 text-forest-700 grid place-items-center">
                <Icon name={w.icon} size={19} />
              </span>
              <div>
                <h3 className="text-[15.5px] font-semibold text-ink">{w.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{w.body}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Programs */}
      <section className="bg-cream border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle eyebrow="Academic programmes" title="Three sections, one continuous journey" />
            <Link to="/academics" className="text-[14px] font-medium text-forest-700 hover:underline inline-flex items-center gap-1.5">
              Explore the full curriculum <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PROGRAMS.map((p) =>
            <motion.div key={p.slug} {...fade}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <img src={(IMAGES as any)[p.image]} alt={p.name} className="h-44 w-full object-cover" />
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[12.5px] font-medium text-gold-600">{p.ages}</p>
                    <h3 className="mt-1 font-serif text-[21px] text-ink">{p.name}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{p.blurb}</p>
                    <p className="mt-4 text-[13px] text-ink-muted">
                      <span className="font-medium text-ink">Subjects · </span>
                      {p.subjects.slice(0, 4).join(', ')}
                      {p.subjects.length > 4 && ` +${p.subjects.length - 4} more`}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link to="/academics">
                        <Button variant="secondary" size="sm" full>
                          View programme
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* School life */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <SectionTitle eyebrow="School life" title="The hours that shape a childhood" intro="Thirty-one clubs, four houses, two terms of inter-school sport and a calendar that gives every child something to be known for." />
            <Link to="/school-life" className="mt-6 inline-block">
              <Button variant="secondary">See school life</Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {SCHOOL_LIFE.slice(0, 4).map((s) =>
            <motion.figure key={s.title} {...fade} className="group">
                <img src={(IMAGES as any)[s.image]} alt={s.title} className="w-full aspect-[5/4] object-cover rounded-card" />
                <figcaption className="mt-3">
                  <h3 className="text-[15px] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{s.body}</p>
                </figcaption>
              </motion.figure>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-forest-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
          <h2 className="font-serif text-[30px] sm:text-[38px] max-w-xl leading-tight">What our families say</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) =>
            <motion.blockquote key={t.name} {...fade} className={i === 0 ? 'lg:row-span-1 rounded-card bg-white/10 p-6' : 'rounded-card bg-white/5 p-6'}>
                <QuoteIcon size={20} className="text-gold-300" />
                <p className="mt-3 text-[15px] leading-relaxed text-forest-50">{t.quote}</p>
                <footer className="mt-5 text-[13px]">
                  <span className="block font-semibold text-white">{t.name}</span>
                  <span className="block text-forest-200">{t.role}</span>
                </footer>
              </motion.blockquote>
            )}
          </div>
        </div>
      </section>

      {/* News & events */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
          <div>
            <div className="flex items-end justify-between gap-4">
              <SectionTitle eyebrow="Latest from school" title="News & announcements" />
              <Link to="/news" className="text-[14px] font-medium text-forest-700 hover:underline whitespace-nowrap">
                All news
              </Link>
            </div>
            <ul className="mt-8 divide-y divide-line border-t border-line">
              {NEWS.slice(0, 4).map((n) =>
              <li key={n.id} className="py-5">
                  <Link to="/news" className="group block">
                    <div className="flex items-center gap-3 text-[12.5px]">
                      <span className="font-medium text-gold-600">{n.category}</span>
                      <span className="text-ink-soft">{n.date}</span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-[20px] text-ink group-hover:text-forest-700 transition-colors duration-150">{n.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{n.excerpt}</p>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink flex items-center gap-2">
                <CalendarDaysIcon size={17} className="text-forest-700" /> Upcoming events
              </h3>
              <ul className="mt-4 space-y-4">
                {EVENTS.slice(0, 4).map((e) =>
                <li key={e.id} className="flex gap-3.5">
                    <div className="w-12 shrink-0 rounded-lg bg-forest-50 text-center py-1.5">
                      <span className="block text-[17px] font-semibold text-forest-800 leading-none">{e.date.split(' ')[0]}</span>
                      <span className="block text-[11px] uppercase text-forest-600 mt-0.5">{e.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-ink leading-snug">{e.title}</p>
                      <p className="text-[12.5px] text-ink-muted mt-0.5">
                        {e.time} · {e.location}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </Card>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {GALLERY.slice(0, 6).map((g) =>
              <img key={g.id} src={(IMAGES as any)[g.image]} alt={g.title} className="aspect-square w-full object-cover rounded-md" />
              )}
            </div>
            <Link to="/school-life" className="mt-3 inline-block text-[13.5px] font-medium text-forest-700 hover:underline">
              Browse the gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="bg-cream border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20">
          <div className="rounded-card bg-forest-800 text-white px-6 sm:px-12 py-12 lg:py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <h2 className="font-serif text-[30px] sm:text-[38px] leading-tight">Join the January 2027 intake</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-forest-100/90 max-w-xl">
                Applications take about fifteen minutes and are saved as you go. Decisions are released within ten working days of assessment, and you can
                follow every stage in the tracker.
              </p>
              <p className="mt-4 text-[13.5px] text-forest-200">
                Questions? Call {SCHOOL.phone} · {SCHOOL.hours}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/apply">
                <Button variant="gold" size="lg" full>
                  Start an application
                </Button>
              </Link>
              <Link to="/visit">
                <Button variant="secondary" size="lg" full className="bg-white/10 text-white border-white/25 hover:bg-white/15">
                  Book a school visit
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="ghost" size="lg" full className="text-forest-100 hover:bg-white/10 hover:text-white">
                  Track an existing application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);

}