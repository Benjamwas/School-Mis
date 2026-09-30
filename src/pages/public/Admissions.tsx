import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon, FileTextIcon } from 'lucide-react';
import { Button, Card, SectionTitle, cx } from '../../components/ui/primitives';
import { ADMISSION_REQUIREMENTS, ADMISSION_STEPS, FAQS, FEE_STRUCTURE, IMAGES, PROGRAMS } from '../../data/school';
import { formatKES } from '../../data/finance';
import { PageHero } from './PageHero';
import { useApp } from '../../contexts/AppContext';

const DATES = [
  { label: 'Applications open', value: '1 August 2026' },
  { label: 'Assessment days', value: 'Every Thursday, 9:00am' },
  { label: 'Offer letters released', value: 'Within 10 working days' },
  { label: 'Commitment fee deadline', value: '30 November 2026' },
  { label: 'Term 1 begins', value: '6 January 2027' }
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function Admissions() {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);
  const { darkMode } = useApp();

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Admissions"
        title="Joining SALA, Step By Step"
        intro="Places for the January 2027 intake are open across ECD, Lower Primary and Upper Primary. Here is exactly what to expect, what it costs and how long it takes."
        image={IMAGES.hero}
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div>
              <motion.div {...fade}>
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                  <span className="w-8 h-[2px] bg-gold" />
                  The Process
                </span>
                <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                  Five Stages From First Call To First Day
                </h2>
              </motion.div>
              
              <ol className="mt-8 space-y-6">
                {ADMISSION_STEPS.map((s, i) => (
                  <motion.li 
                    key={s.step} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5"
                  >
                    <span className="font-heading text-[24px] font-black text-gold w-8 shrink-0">{s.step}</span>
                    <div className="border-b border-surface-border dark:border-white/10 pb-6 flex-1">
                      <h3 className="text-[16px] font-heading font-bold heading-color">{s.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{s.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-12">
                <motion.div {...fade}>
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                    <span className="w-8 h-[2px] bg-gold" />
                    Available Places
                  </span>
                  <h2 className="font-heading text-[28px] sm:text-[36px] font-black heading-color leading-[1.1]">
                    Where We Currently Have Space
                  </h2>
                </motion.div>
                
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  {PROGRAMS.map((p, i) => (
                    <motion.div 
                      key={p.slug} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="p-5 glass-card hover-lift">
                        <p className="text-[13px] font-semibold text-gold">{p.ages.split('·')[1]}</p>
                        <p className="mt-2 text-[15px] font-heading font-bold heading-color">{p.name}</p>
                        <p className="mt-2 text-[13.5px] text-ink-muted dark:text-gray-400">{[14, 9, 6][i]} places available</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div {...fade}>
                <Card className="p-6 glass-card">
                  <h3 className="font-heading text-[16px] font-bold heading-color">Requirements</h3>
                  <ul className="mt-4 space-y-3">
                    {ADMISSION_REQUIREMENTS.map((r) => (
                      <li key={r} className="flex gap-2.5 text-[13.5px] text-ink-muted dark:text-gray-400">
                        <CheckIcon size={15} className="mt-0.5 shrink-0 text-gold" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div {...fade}>
                <Card className="p-6 glass-card">
                  <h3 className="font-heading text-[16px] font-bold heading-color">Important Dates</h3>
                  <dl className="mt-4 divide-y divide-surface-border dark:divide-white/10">
                    {DATES.map((d) => (
                      <div key={d.label} className="flex justify-between gap-4 py-3">
                        <dt className="text-[13.5px] text-ink-muted dark:text-gray-400">{d.label}</dt>
                        <dd className="text-[13.5px] font-semibold text-ink dark:text-white text-right">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              </motion.div>

              <motion.div {...fade}>
                <Card className="p-6 bg-gradient-to-br from-navy-900 to-navy-800 border-none text-white">
                  <h3 className="font-heading text-[16px] font-bold">Ready to Apply?</h3>
                  <p className="mt-2 text-[13.5px] text-gray-300">Seven short steps, about fifteen minutes. Your progress is saved automatically.</p>
                  <div className="mt-5 space-y-3">
                    <Link to="/apply">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="gold" full className="rounded-full">
                          Start Application
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/visit">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="secondary" full className="glass text-white border-white/25 hover:bg-white/10 rounded-full">
                          Book a School Visit
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-gold" />
              Fees
            </span>
            <h2 className="font-heading text-[32px] sm:text-[42px] font-black text-white leading-[1.1]">
              Termly Fees For 2027
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-400 max-w-2xl mx-auto">
              All figures are per term in Kenyan Shillings. Transport and lunch are optional. Instalment plans are available by arrangement with the finance office.
            </p>
          </motion.div>
          
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] glass-card rounded-2xl text-sm overflow-hidden">
              <thead>
                <tr className="border-b border-white/10">
                  {['Level', 'Tuition', 'Transport', 'Meals', 'Total per term'].map((h) => (
                    <th key={h} className="px-5 py-4 text-[12px] font-semibold uppercase tracking-wide text-gold text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEE_STRUCTURE.map((f) => (
                  <tr key={f.level} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="px-5 py-4 font-heading font-semibold text-white">{f.level}</td>
                    <td className="px-5 py-4 text-gray-400 tabular-nums">{formatKES(f.tuition)}</td>
                    <td className="px-5 py-4 text-gray-400 tabular-nums">{formatKES(f.transport)}</td>
                    <td className="px-5 py-4 text-gray-400 tabular-nums">{formatKES(f.meals)}</td>
                    <td className="px-5 py-4 font-semibold text-gold tabular-nums">{formatKES(f.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12.5px] text-gray-400 flex items-center gap-2">
            <FileTextIcon size={14} className="text-gold" /> A one-off admission fee of {formatKES(25000)} applies to new learners.
          </p>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
          <motion.div {...fade}>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
              <span className="w-8 h-[2px] bg-gold" />
              FAQs
            </span>
            <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
              Questions We Are Asked Most
            </h2>
          </motion.div>
          
          <ul className="divide-y divide-surface-border dark:divide-white/10 border-y border-surface-border dark:border-white/10">
            {FAQS.map((f, i) => {
              const on = open === f.q;
              return (
                <motion.li 
                  key={f.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button 
                    onClick={() => setOpen(on ? null : f.q)} 
                    aria-expanded={on} 
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span className="text-[15px] font-heading font-semibold heading-color group-hover:text-gold transition-colors duration-200">
                      {f.q}
                    </span>
                    <ChevronDownIcon 
                      size={18} 
                      className={cx(
                        'shrink-0 text-ink-muted dark:text-gray-400 transition-transform duration-300 ease-sala', 
                        on && 'rotate-180 text-gold'
                      )} 
                    />
                  </button>
                  <AnimatePresence>
                    {on && (
                      <motion.p 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pb-5 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400 max-w-2xl overflow-hidden"
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
