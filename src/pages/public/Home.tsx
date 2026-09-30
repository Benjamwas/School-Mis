import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, CalendarDaysIcon, PlayCircleIcon, QuoteIcon, StarIcon, BookOpenIcon, HeartIcon, SparklesIcon, RocketIcon, GraduationCapIcon } from 'lucide-react';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { EVENTS, GALLERY, HIGHLIGHTS, IMAGES, NEWS, PROGRAMS, SCHOOL, SCHOOL_LIFE, TESTIMONIALS, WHY_SALA } from '../../data/school';
import { useApp } from '../../contexts/AppContext';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' }
};

export function Home() {
  const { darkMode } = useApp();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${IMAGES.hero})`, scale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900/90" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/30 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                scale: 0
              }}
              animate={{ 
                y: [null, '-100%'],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8"
            >
              <SparklesIcon size={16} className="text-gold" />
              <span className="text-[13px] font-medium text-white/90">Shaping Futures Since 2002</span>
            </motion.div>
            
            <h1 className="font-heading text-heading-2xl font-black leading-[1.05] tracking-tight">
              ST. ANN LIFRED{' '}
              <span className="text-gradient">ACADEMY</span>{' '}
              SCHOOLS
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 text-[18px] sm:text-[22px] text-gray-200 font-medium max-w-2xl mx-auto"
            >
              "Shaping Confident Learners For A Global Future"
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link to="/apply">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    size="lg" 
                    className="glass-gold text-navy font-bold rounded-full px-10 py-4 text-[15px] btn-glow shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  >
                    Apply Now
                  </Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="glass text-white border-white/30 hover:bg-white/20 rounded-full px-10 py-4 text-[15px] transition-all duration-300"
                  >
                    Discover More <ArrowRightIcon size={16} className="ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="glass-card rounded-2xl p-5 text-center hover-lift"
              >
                <span className="text-gradient text-3xl md:text-4xl font-black font-heading">{h.value}</span>
                <p className="mt-2 text-[12px] text-gray-300 font-medium">{h.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Discover Our School */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fade}>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider"
              >
                <span className="w-8 h-[2px] bg-gold" />
                Discover Our School
              </motion.span>
              
              <h2 className="font-heading text-heading-xl heading-color leading-[1.1]">
                A Legacy of{' '}
                <span className="text-gradient">Educational Excellence</span>
              </h2>
              
              <p className="mt-6 text-[16px] leading-relaxed text-ink-muted dark:text-gray-400">
                St. Ann Lifred Academy Schools is more than classrooms and corridors — it's a place where sparks are lit, characters take shape, and friendships begin. Here, every student's story matters.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-muted dark:text-gray-400">
                At SALA, we believe in holistic education — one that balances academic excellence with character development, creativity, global awareness, and compassion.
              </p>
              
              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow">
                      <BookOpenIcon size={22} className="text-navy" />
                    </span>
                    <h3 className="font-heading text-[16px] font-bold heading-color">Our Vision</h3>
                  </div>
                  <p className="text-[14px] text-ink-muted dark:text-gray-400 leading-relaxed">
                    To provide high-quality education for a multicultural society.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                      <HeartIcon size={22} className="text-white" />
                    </span>
                    <h3 className="font-heading text-[16px] font-bold heading-color">Core Values</h3>
                  </div>
                  <p className="text-[14px] text-ink-muted dark:text-gray-400 leading-relaxed">
                    Integrity, Excellence, and Perseverance in all endeavors.
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div {...fade} className="relative">
              <div className="relative">
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  src={IMAGES.classroom} 
                  alt="Students learning at SALA" 
                  className="w-full aspect-[4/3] object-cover rounded-2xl shadow-card" 
                />
                <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-2xl shadow-pop max-w-[300px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                      <StarIcon size={16} className="text-navy" />
                    </span>
                    <h4 className="font-heading text-[15px] font-bold heading-color">The Difference</h4>
                  </div>
                  <p className="text-[13px] text-ink-muted dark:text-gray-400 leading-relaxed">
                    We focus on individualized learning, equipping students with critical-thinking and 21st-century technological competencies.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why SALA */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-gold" />
              Why Choose Us
              <span className="w-8 h-[2px] bg-gold" />
            </span>
            <h2 className="font-heading text-heading-xl heading-color leading-[1.1]">
              An Education Built Around{' '}
              <span className="text-gradient">The Child</span>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-gray-400 max-w-2xl mx-auto">
              Nine years of CBC delivery, refined into a school day that is calm, structured and unmistakably warm.
            </p>
          </motion.div>
          
          <div className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_SALA.map((w, i) => (
              <motion.div 
                key={w.title} 
                {...stagger}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <span className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center group-hover:from-gold group-hover:to-gold-dark transition-all duration-300">
                    <Icon name={w.icon} size={24} className="text-gold group-hover:text-navy transition-colors duration-300" />
                  </span>
                  <div>
                    <h3 className="font-heading text-[17px] font-bold text-white">{w.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-400">{w.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div {...fade}>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                <span className="w-8 h-[2px] bg-gold" />
                Academic Programmes
              </span>
              <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                Three Sections, One Journey
              </h2>
            </motion.div>
            <Link to="/academics" className="text-[14px] font-semibold text-gold hover:text-gold-dark inline-flex items-center gap-2 group">
              Explore curriculum 
              <ArrowRightIcon size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PROGRAMS.map((p, i) => (
              <motion.div 
                key={p.slug} 
                {...stagger}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="overflow-hidden h-full flex flex-col glass-card hover-lift group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={(IMAGES as any)[p.image]} 
                      alt={p.name} 
                      className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 glass rounded-full px-4 py-1.5 text-[12px] font-bold text-white uppercase tracking-wider">
                      {p.ages}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-[20px] font-bold heading-color group-hover:text-gold transition-colors duration-300">{p.name}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{p.blurb}</p>
                    <p className="mt-4 text-[13px] text-ink-muted dark:text-gray-400">
                      <span className="font-semibold text-ink dark:text-white">Subjects · </span>
                      {p.subjects.slice(0, 4).join(', ')}
                      {p.subjects.length > 4 && ` +${p.subjects.length - 4} more`}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link to="/academics">
                        <Button variant="secondary" size="sm" full className="group-hover:border-gold group-hover:text-gold transition-all duration-300">
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

      {/* School life */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <motion.div {...fade}>
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                  <span className="w-8 h-[2px] bg-gold" />
                  School Life
                </span>
                <h2 className="font-heading text-[32px] sm:text-[42px] font-black text-white leading-[1.1]">
                  The Hours That Shape A Childhood
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-gray-400">
                  Thirty-one clubs, four houses, two terms of inter-school sport and a calendar that gives every child something to be known for.
                </p>
              </motion.div>
              <Link to="/school-life" className="mt-6 inline-block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="secondary" className="glass text-white border-white/30 hover:bg-white/10">
                    See School Life
                  </Button>
                </motion.div>
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-5">
              {SCHOOL_LIFE.slice(0, 4).map((s, i) => (
                <motion.figure 
                  key={s.title} 
                  {...stagger}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={(IMAGES as any)[s.image]} 
                      alt={s.title} 
                      className="w-full aspect-[5/4] object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <figcaption className="mt-4">
                    <h3 className="font-heading text-[17px] font-bold text-white group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-gray-400">{s.body}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-gold" />
              Testimonials
            </span>
            <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
              What Our Families Say
            </h2>
          </motion.div>
          
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote 
                key={t.name} 
                {...stagger}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 hover-lift"
              >
                <QuoteIcon size={32} className="text-gold/50" />
                <p className="mt-4 text-[15px] leading-relaxed text-ink dark:text-gray-300 italic">"{t.quote}"</p>
                <footer className="mt-6 pt-4 border-t border-surface-border dark:border-white/10">
                  <span className="block font-heading font-bold heading-color">{t.name}</span>
                  <span className="block text-[13px] text-gold mt-1">{t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* News & events */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
            <div>
              <div className="flex items-end justify-between gap-4">
                <motion.div {...fade}>
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                    <span className="w-8 h-[2px] bg-gold" />
                    Latest News
                  </span>
                  <h2 className="font-heading text-[32px] sm:text-[42px] font-black text-white leading-[1.1]">
                    News & Announcements
                  </h2>
                </motion.div>
                <Link to="/news" className="text-[14px] font-semibold text-gold hover:text-gold-dark whitespace-nowrap">
                  View All →
                </Link>
              </div>
              
              <ul className="mt-8 space-y-4">
                {NEWS.slice(0, 4).map((n, i) => (
                  <motion.li 
                    key={n.id} 
                    {...stagger}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link to="/news" className="group block glass-card rounded-xl p-5 hover-lift">
                      <div className="flex items-center gap-3 text-[12.5px]">
                        <span className="font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">{n.category}</span>
                        <span className="text-gray-500">{n.date}</span>
                      </div>
                      <h3 className="mt-3 font-heading text-[18px] text-white group-hover:text-gold transition-colors duration-300 font-bold">{n.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-gray-400">{n.excerpt}</p>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <motion.div {...fade}>
                <Card className="p-6 glass-card">
                  <h3 className="font-heading text-[18px] font-bold text-white flex items-center gap-2">
                    <CalendarDaysIcon size={20} className="text-gold" /> Upcoming Events
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {EVENTS.slice(0, 4).map((e, i) => (
                      <motion.li 
                        key={e.id} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3.5 group"
                      >
                        <div className="w-14 shrink-0 rounded-xl bg-gradient-to-br from-gold to-gold-dark text-center py-2 group-hover:scale-105 transition-transform duration-300">
                          <span className="block text-[18px] font-bold text-navy leading-none">{e.date.split(' ')[0]}</span>
                          <span className="block text-[10px] uppercase text-navy/70 mt-0.5 font-semibold">{e.date.split(' ')[1]}</span>
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-white leading-snug group-hover:text-gold transition-colors duration-300">{e.title}</p>
                          <p className="text-[12.5px] text-gray-500 mt-0.5">
                            {e.time} · {e.location}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {GALLERY.slice(0, 6).map((g, i) => (
                  <motion.img 
                    key={g.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    src={(IMAGES as any)[g.image]} 
                    alt={g.title} 
                    className="aspect-square w-full object-cover rounded-xl cursor-pointer" 
                  />
                ))}
              </div>
              <Link to="/school-life" className="mt-4 inline-block text-[14px] font-semibold text-gold hover:text-gold-dark">
                Browse Gallery →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white px-6 sm:px-12 py-12 lg:py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-40" />
            
            <div className="relative">
              <motion.h2 
                {...fade}
                className="font-heading text-[30px] sm:text-[40px] leading-tight font-black"
              >
                Join the January 2027 Intake
              </motion.h2>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-300 max-w-xl">
                Applications take about fifteen minutes and are saved as you go. Decisions are released within ten working days of assessment, and you can
                follow every stage in the tracker.
              </p>
              <p className="mt-4 text-[14px] text-gray-400">
                Questions? Call {SCHOOL.phone} · {SCHOOL.hours}
              </p>
            </div>
            
            <div className="relative flex flex-col gap-3">
              <Link to="/apply">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="gold" size="lg" full className="rounded-full btn-glow shadow-glow">
                    Start an Application
                  </Button>
                </motion.div>
              </Link>
              <Link to="/visit">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="secondary" size="lg" full className="glass text-white border-white/25 hover:bg-white/10 rounded-full">
                    Book a School Visit
                  </Button>
                </motion.div>
              </Link>
              <Link to="/track">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="ghost" size="lg" full className="text-gray-300 hover:bg-white/10 hover:text-white">
                    Track an Existing Application
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
