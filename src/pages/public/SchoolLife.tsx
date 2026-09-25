import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SectionTitle, cx } from '../../components/ui/primitives';
import { GALLERY, IMAGES, SCHOOL_LIFE } from '../../data/school';
import { PageHero } from './PageHero';

const CATEGORIES = ['All', 'Academics', 'Sports', 'Events', 'Trips', 'Activities', 'School Life'];

export function SchoolLife() {
  const [cat, setCat] = useState('All');
  const albums = cat === 'All' ? GALLERY : GALLERY.filter((g) => g.category === cat);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="School life"
        title="What happens between the lessons"
        intro="Sport four afternoons a week, thirty-one clubs, four houses competing all year, and a trip every term that takes learning off the campus."
        image={IMAGES.sports} />
      

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOOL_LIFE.map((s) =>
          <figure key={s.title}>
              <img src={(IMAGES as any)[s.image]} alt={s.title} className="w-full aspect-[5/4] object-cover rounded-card" />
              <figcaption className="mt-3.5">
                <h2 className="text-[16px] font-semibold text-ink">{s.title}</h2>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="bg-cream border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle eyebrow="Gallery" title="Moments from this term" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) =>
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
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((g) =>
            <button key={g.id} className="group text-left">
                <div className="relative overflow-hidden rounded-card">
                  <img
                  src={(IMAGES as any)[g.image]}
                  alt={g.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-300 ease-sala group-hover:scale-[1.03]" />
                
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-medium text-ink">{g.count} photos</span>
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold text-ink">{g.title}</h3>
                <p className="text-[13px] text-ink-muted">{g.category}</p>
              </button>
            )}
          </div>
          {albums.length === 0 && <p className="mt-10 text-center text-sm text-ink-muted">No albums in this category yet.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
        <SectionTitle center eyebrow="Come and see" title="A tour tells you more than any photograph" intro="Visit on a school day and watch an ordinary morning at SALA." />
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/visit">
            <Button size="lg">Book a school visit</Button>
          </Link>
          <Link to="/apply">
            <Button size="lg" variant="secondary">
              Apply for admission
            </Button>
          </Link>
        </div>
      </section>
    </div>);

}