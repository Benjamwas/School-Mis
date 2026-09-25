import React, { useState } from 'react';
import { CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import { Badge, Button, Card, SectionTitle, cx } from '../../components/ui/primitives';
import { EVENTS, IMAGES, NEWS } from '../../data/school';
import { PageHero } from './PageHero';

const CATS = ['All', 'Academics', 'Notice', 'School News', 'School Life'];

export function NewsEvents() {
  const [cat, setCat] = useState('All');
  const items = cat === 'All' ? NEWS : NEWS.filter((n) => n.category === cat);
  const [lead, ...rest] = items;

  return (
    <div className="w-full">
      <PageHero
        eyebrow="News & events"
        title="What’s happening at SALA"
        intro="Announcements, term notices and the events calendar — the same information that goes out in the parent portal." />
      

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-[1.4fr_0.6fr] gap-12">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-8">
            {CATS.map((c) =>
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={cx(
                'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                cat === c ? 'border-forest-700 bg-forest-700 text-white' : 'border-line bg-white text-ink-muted hover:border-forest-300 hover:text-ink'
              )}>
              
                {c}
              </button>
            )}
          </div>

          {!lead ?
          <p className="text-sm text-ink-muted">Nothing published in this category yet.</p> :

          <>
              <article className="group">
                <img src={IMAGES.classroom} alt="" className="w-full aspect-[16/9] object-cover rounded-card" />
                <div className="mt-4 flex items-center gap-3 text-[12.5px]">
                  <Badge tone="warning">{lead.category}</Badge>
                  <span className="text-ink-soft">{lead.date}</span>
                  <span className="text-ink-soft">· {lead.author}</span>
                </div>
                <h2 className="mt-2 font-serif text-[28px] leading-tight text-ink">{lead.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{lead.excerpt}</p>
                <Button variant="secondary" size="sm" className="mt-4">
                  Read article
                </Button>
              </article>

              <ul className="mt-10 divide-y divide-line border-t border-line">
                {rest.map((n) =>
              <li key={n.id} className="py-5 flex gap-5">
                    <img src={IMAGES.library} alt="" className="hidden sm:block h-24 w-32 shrink-0 object-cover rounded-lg" />
                    <div>
                      <div className="flex items-center gap-3 text-[12.5px]">
                        <span className="font-medium text-gold-600">{n.category}</span>
                        <span className="text-ink-soft">{n.date}</span>
                      </div>
                      <h3 className="mt-1 font-serif text-[20px] text-ink">{n.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{n.excerpt}</p>
                    </div>
                  </li>
              )}
              </ul>
            </>
          }
        </div>

        <aside>
          <SectionTitle eyebrow="Calendar" title="Upcoming events" />
          <ul className="mt-6 space-y-3">
            {EVENTS.map((e) =>
            <li key={e.id}>
                <Card className="p-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 shrink-0 rounded-lg bg-forest-50 text-center py-1.5">
                      <span className="block text-[17px] font-semibold text-forest-800 leading-none">{e.date.split(' ')[0]}</span>
                      <span className="block text-[11px] uppercase text-forest-600 mt-0.5">{e.date.split(' ')[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink leading-snug">{e.title}</p>
                      <p className="mt-1 text-[12.5px] text-ink-muted flex items-center gap-1.5">
                        <CalendarDaysIcon size={13} /> {e.time}
                      </p>
                      <p className="text-[12.5px] text-ink-muted flex items-center gap-1.5">
                        <MapPinIcon size={13} /> {e.location}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            )}
          </ul>
        </aside>
      </section>
    </div>);

}