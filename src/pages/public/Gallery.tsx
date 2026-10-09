import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CameraIcon, MessageCircleIcon, XIcon, ZoomInIcon } from 'lucide-react';
import { Button, cx } from '../../components/ui/primitives';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS, IMAGES, SCHOOL, WHATSAPP_URL } from '../../data/school';
import { PageHero } from './PageHero';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function Gallery() {
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const photos = cat === 'All' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.category === cat);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Gallery"
        title="A Peek Into The Laughter, Learning And Little Adventures"
        intro="Every corridor, every smile, tells our story. Browse moments from classrooms, sports, music, trips and life on campus."
        image={IMAGES.arts}
        compact
      />

      {/* Sticky filter */}
      <div className="relative z-20 sticky top-[72px] sm:top-[80px] bg-surface-light/95 dark:bg-navy-dark/95 backdrop-blur-md border-b border-surface-border dark:border-white/10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {GALLERY_CATEGORIES.map((c) => {
            const on = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={on}
                className={cx(
                  'flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200',
                  on
                    ? 'bg-navy-deep text-white shadow-soft'
                    : 'bg-card border border-surface-border/60 text-ink-muted hover:border-gold/50 hover:text-ink dark:bg-white/5 dark:border-white/10 dark:text-gray-300'
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry grid */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-15" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <motion.div {...fade}>
              <span className="pill mb-3 inline-flex">
                <CameraIcon size={12} className="text-gold" />
                {cat === 'All' ? 'All moments' : cat}
              </span>
              <h2 className="font-display text-[28px] sm:text-[36px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                {photos.length} moments from SALA
              </h2>
            </motion.div>
            <a
              href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would love to see more photos from the school.`)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" className="rounded-full">
                <MessageCircleIcon size={15} className="text-accent-whatsapp" />
                Request more photos
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[170px] sm:auto-rows-[200px]">
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActive(i)}
                className={cx(
                  'group relative overflow-hidden rounded-2xl shadow-soft',
                  i % 7 === 0 && 'row-span-2 col-span-2 sm:col-span-1 sm:row-span-2',
                  i % 5 === 0 && 'sm:col-span-2'
                )}
              >
                <img
                  src={(IMAGES as any)[p.image]}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="h-11 w-11 rounded-full bg-white/20 backdrop-blur grid place-items-center">
                    <ZoomInIcon size={18} className="text-white" />
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-[12px] font-semibold text-white leading-snug">{p.title}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gold mt-0.5">{p.category}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {photos.length === 0 && (
            <p className="mt-16 text-center text-sm text-ink-muted dark:text-gray-400">No photos in this category yet.</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === null ? null : (a - 1 + photos.length) % photos.length)); }}
              className="absolute left-3 sm:left-8 h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              ‹
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={(IMAGES as any)[photos[active].image]}
                alt={photos[active].title}
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-elevated"
              />
              <figcaption className="mt-4 text-center">
                <p className="font-heading font-bold text-white text-lg">{photos[active].title}</p>
                <p className="text-[12px] uppercase tracking-wider text-gold mt-1">{photos[active].category}</p>
              </figcaption>
            </motion.figure>
            <button
              onClick={(e) => { e.stopPropagation(); setActive((a) => (a === null ? null : (a + 1) % photos.length)); }}
              className="absolute right-3 sm:right-8 h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden section-on-navy">
        <div className="absolute inset-0 bg-gradient-hero" />
        <FloatingSchoolDecor variant="navy" density="low" seed={10} />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.div {...fade}>
            <h2 className="font-display text-[30px] sm:text-[42px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              See it in person
            </h2>
            <p className="mt-4 text-[15.5px] text-white/70 max-w-2xl mx-auto">
              Photographs capture a moment — a tour shows you the whole school. Visit on a school day
              and feel the difference.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/admissions">
                <Button size="lg" className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow px-8">
                  Book a School Visit
                </Button>
              </Link>
              <Link to="/campus">
                <Button size="lg" variant="secondary" className="rounded-full bg-white/10 border-white/25 text-white hover:bg-white/15 backdrop-blur px-8">
                  Explore Campus
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
