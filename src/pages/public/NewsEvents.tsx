import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import { Badge, Button, Card, SectionTitle, cx } from '../../components/ui/primitives';
import { EVENTS, IMAGES, NEWS } from '../../data/school';
import { PageHero } from './PageHero';

const CATS = ['All', 'Academics', 'Notice', 'School News', 'School Life'];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function NewsEvents() {
  const [cat, setCat] = useState('All');
  const items = cat === 'All' ? NEWS : NEWS.filter((n) => n.category === cat);
  const [lead, ...rest] = items;

  return (
    <div className="w-full">
      <PageHero
        eyebrow="News & events"
        title="What's Happening At SALA"
        intro="Announcements, term notices and the events calendar — the same information that goes out in the parent portal."
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.4fr_0.6fr] gap-12">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cx(
                    'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                    cat === c 
                      ? 'border-gold bg-gold text-navy' 
                      : 'border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink-muted dark:text-gray-400 hover:border-gold hover:text-ink dark:hover:text-white'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {!lead ? (
              <p className="text-sm text-ink-muted dark:text-gray-400">Nothing published in this category yet.</p>
            ) : (
              <>
                <motion.article {...fade} className="group">
                  <div className="relative overflow-hidden rounded-card">
                    <img src={IMAGES.classroom} alt="" className="w-full aspect-[16/9] object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-[12.5px]">
                    <Badge tone="warning">{lead.category}</Badge>
                    <span className="text-ink-soft dark:text-gray-500">{lead.date}</span>
                    <span className="text-ink-soft dark:text-gray-500">· {lead.author}</span>
                  </div>
                  <h2 className="mt-3 font-heading text-[28px] font-bold leading-tight heading-color">{lead.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">{lead.excerpt}</p>
                  <Button variant="secondary" size="sm" className="mt-4 rounded-full">
                    Read article
                  </Button>
                </motion.article>

                <ul className="mt-10 divide-y divide-surface-border dark:divide-white/10 border-t border-surface-border dark:border-white/10">
                  {rest.map((n, i) => (
                    <motion.li 
                      key={n.id} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="py-5 flex gap-5"
                    >
                      <img src={IMAGES.library} alt="" className="hidden sm:block h-24 w-32 shrink-0 object-cover rounded-lg" />
                      <div>
                        <div className="flex items-center gap-3 text-[12.5px]">
                          <span className="font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">{n.category}</span>
                          <span className="text-ink-soft dark:text-gray-500">{n.date}</span>
                        </div>
                        <h3 className="mt-2 font-heading text-[20px] font-bold heading-color hover:text-gold transition-colors duration-200">{n.title}</h3>
                        <p className="mt-1 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{n.excerpt}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            <SectionTitle eyebrow="Calendar" title="Upcoming Events" />
            <ul className="mt-6 space-y-3">
              {EVENTS.map((e, i) => (
                <motion.li 
                  key={e.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-4 hover-lift">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 shrink-0 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-center py-1.5">
                        <span className="block text-[17px] font-bold text-navy leading-none">{e.date.split(' ')[0]}</span>
                        <span className="block text-[10px] uppercase text-navy/70 mt-0.5 font-semibold">{e.date.split(' ')[1]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-heading font-semibold heading-color leading-snug">{e.title}</p>
                        <p className="mt-1 text-[12.5px] text-ink-muted dark:text-gray-400 flex items-center gap-1.5">
                          <CalendarDaysIcon size={13} className="text-gold" /> {e.time}
                        </p>
                        <p className="text-[12.5px] text-ink-muted dark:text-gray-400 flex items-center gap-1.5">
                          <MapPinIcon size={13} className="text-gold" /> {e.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
