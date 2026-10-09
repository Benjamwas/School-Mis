import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, SectionTitle, cx } from '../../components/ui/primitives';
import { GALLERY, IMAGES, SCHOOL_LIFE } from '../../data/school';
import { PageHero } from './PageHero';

const CATEGORIES = ['All', 'Academics', 'Sports', 'Events', 'Trips', 'Activities', 'School Life'];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function SchoolLife() {
  const [cat, setCat] = useState('All');
  const albums = cat === 'All' ? GALLERY : GALLERY.filter((g) => g.category === cat);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="School life"
        title="What Happens Between The Lessons"
        intro="Sport four afternoons a week, thirty-one clubs, four houses competing all year, and a trip every term that takes learning off the campus."
        image={IMAGES.sports}
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SCHOOL_LIFE.map((s, i) => (
              <motion.figure 
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative overflow-hidden rounded-card">
                  <img src={(IMAGES as any)[s.image]} alt={s.title} className="w-full aspect-[5/4] object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                </div>
                <figcaption className="mt-4">
                  <h2 className="text-[16px] font-heading font-bold text-ink dark:text-white">{s.title}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{s.body}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14 lg:py-20 overflow-hidden section-on-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle eyebrow="Gallery" title="Moments From This Term" tone="dark" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cx(
                    'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
                    cat === c 
                      ? 'border-gold bg-gold text-navy' 
                      : 'border-white/20 bg-white/5 text-gray-400 hover:border-gold hover:text-white'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((g, i) => (
              <motion.button 
                key={g.id} 
                className="group text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative overflow-hidden rounded-card">
                  <img
                    src={(IMAGES as any)[g.image]}
                    alt={g.title}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-300 ease-sala group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full glass px-2.5 py-1 text-[11.5px] font-medium text-white">
                    {g.count} photos
                  </span>
                </div>
                <h3 className="mt-3 text-[15px] font-heading font-bold text-white group-hover:text-gold transition-colors duration-200">{g.title}</h3>
                <p className="text-[13px] text-gray-400">{g.category}</p>
              </motion.button>
            ))}
          </div>
          {albums.length === 0 && (
            <p className="mt-10 text-center text-sm text-gray-400">No albums in this category yet.</p>
          )}
        </div>
      </section>

      <section className="relative py-16 text-center overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle center eyebrow="Come and see" title="A Tour Tells You More Than Any Photograph" intro="Visit on a school day and watch an ordinary morning at SALA." />
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/visit">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="rounded-full">Book a School Visit</Button>
              </motion.div>
            </Link>
            <Link to="/apply">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="secondary" className="rounded-full">
                  Apply for Admission
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
