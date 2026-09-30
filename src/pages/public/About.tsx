import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Timeline } from '../../components/ui/data';
import { IMAGES, LEADERSHIP, TIMELINE, VALUES } from '../../data/school';
import { PageHero } from './PageHero';
import { useApp } from '../../contexts/AppContext';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function About() {
  const { darkMode } = useApp();
  
  return (
    <div className="w-full">
      <PageHero
        eyebrow="About the school"
        title="A School Built One Classroom At A Time"
        intro="From nineteen children in a converted family home to 1,148 learners on a six-acre Kiambu Road campus — the same conviction has carried us the whole way."
        image={IMAGES.library}
      />

      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <div>
            <motion.div {...fade}>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                <span className="w-8 h-[2px] bg-gold" />
                Our Story
              </span>
              <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                Founded By A Teacher, Still Run Like A Classroom
              </h2>
            </motion.div>
            
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
              <motion.p {...fade}>
                Dr. Ann Lifred Mwangi started SALA in 2002 after fifteen years teaching in public primary schools. She had one rule for the new school: no child
                would be allowed to fall behind quietly. Every decision since — small classes, specialist teachers from Grade 4, a personalised learning profile
                for every learner — comes back to that rule.
              </motion.p>
              <motion.p {...fade}>
                Today SALA educates children from PP1 through Grade 6 across three sections, with an academic team of 86. We are fully aligned to the
                competency-based curriculum and report on it honestly: parents see the topics their child has mastered and the ones needing work, in the same view.
              </motion.p>
              <motion.p {...fade}>
                We are deliberately a primary school. Our job is to hand junior secondary a child who can read for meaning, reason with numbers, work with others,
                and speak up — and who still likes school.
              </motion.p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <motion.div {...fade} whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 hover-lift">
                <h3 className="font-heading text-[20px] font-bold heading-color">Our Vision</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                  To be Kenya's most trusted primary school — where academic excellence and personal character are pursued with equal seriousness.
                </p>
              </motion.div>
              <motion.div {...fade} whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 hover-lift">
                <h3 className="font-heading text-[20px] font-bold heading-color">Our Mission</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                  To provide every learner with a safe, joyful and rigorous education, delivered by excellent teachers in genuine partnership with families.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div {...fade} className="relative overflow-hidden rounded-2xl">
              <img src={IMAGES.classroom} alt="A Grade 3 lesson in progress" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
            </motion.div>
            
            <motion.div {...fade} whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 hover-lift">
              <h3 className="font-heading text-[16px] font-bold heading-color">Educational Philosophy</h3>
              <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                  <span><span className="font-semibold text-ink dark:text-white">Mastery before pace.</span> We do not move on because the term does.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                  <span><span className="font-semibold text-ink dark:text-white">Evidence, not impressions.</span> Every judgement about a child is backed by work we can show you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                  <span><span className="font-semibold text-ink dark:text-white">Warmth with structure.</span> Clear expectations are a form of kindness.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                  <span><span className="font-semibold text-ink dark:text-white">Parents as partners.</span> You should never be surprised by a report card.</span>
                </li>
              </ul>
            </motion.div>
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
              Core Values
            </span>
            <h2 className="font-heading text-[32px] sm:text-[42px] font-black text-white leading-[1.1]">
              Five Things We Will Not Compromise On
            </h2>
          </motion.div>
          
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v, i) => (
              <motion.div 
                key={v.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-5 hover-lift"
              >
                <span className="text-[12px] font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-[16px] font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-gray-400">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
          <div>
            <motion.div {...fade}>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                <span className="w-8 h-[2px] bg-gold" />
                Our History
              </span>
              <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                Milestones
              </h2>
            </motion.div>
            <div className="mt-8">
              <Timeline
                items={TIMELINE.map((t) => ({ title: t.title, meta: t.year, body: t.body, state: 'complete' as const }))}
              />
            </div>
          </div>
          
          <div>
            <motion.div {...fade}>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                <span className="w-8 h-[2px] bg-gold" />
                Leadership
              </span>
              <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                The People Accountable For Your Child's School
              </h2>
            </motion.div>
            <ul className="mt-8 space-y-4">
              {LEADERSHIP.map((l, i) => (
                <motion.li 
                  key={l.name} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="glass-card rounded-xl p-4 hover-lift"
                >
                  <p className="font-heading text-[15px] font-bold heading-color">{l.name}</p>
                  <p className="text-[13px] text-gold font-semibold">{l.role}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{l.note}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-dark to-gold" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.h2 
              {...fade}
              className="font-heading text-[28px] sm:text-[34px] leading-tight font-black text-navy"
            >
              Student Wellbeing & Parent Partnership
            </motion.h2>
            <p className="mt-3 text-[15px] leading-relaxed text-navy/80 max-w-2xl">
              A full-time nurse, two trained counsellors, a no-tolerance bullying policy and a class teacher who calls you before small things become large ones.
              Parents meet teachers formally three times a year, and informally whenever they need to.
            </p>
          </div>
          <div className="flex items-end">
            <Link to="/visit" className="w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="primary" size="lg" full className="bg-navy text-white hover:bg-navy-800 rounded-full">
                  Come and See For Yourself
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
