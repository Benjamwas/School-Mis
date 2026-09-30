import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Tabs } from '../../components/ui/data';
import { IMAGES, PROGRAMS } from '../../data/school';
import { PageHero } from './PageHero';

const ASSESSMENT = [
  { title: 'Daily formative checks', body: 'Short exit tasks at the end of each lesson tell the teacher who needs reteaching tomorrow, not next term.' },
  { title: 'Fortnightly topic assessment', body: 'A graded task per topic, recorded against the CBC strand and visible in the Parent Portal.' },
  { title: 'End of term examinations', body: 'Formal papers from Grade 3, reported with a grade, a percentage and a written teacher comment.' },
  { title: 'Personalised support plan', body: 'Any learner below 60% in a strand gets a named plan with recommended topics and a review date.' }
];

const OUTCOMES = [
  'Reads fluently and for meaning by the end of Grade 3',
  'Applies number, measurement and geometry to real problems',
  'Investigates scientifically and records findings clearly',
  'Communicates confidently in English and Kiswahili',
  'Uses digital tools safely and purposefully',
  'Works in a team and leads when asked to'
];

export function Academics() {
  const [tab, setTab] = useState(PROGRAMS[1].name);
  const program = PROGRAMS.find((p) => p.name === tab) ?? PROGRAMS[0];

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Academics"
        title="A Competency-Based Curriculum, Delivered Properly"
        intro="Structured literacy and numeracy every morning, specialist subject teaching from Grade 4, and assessment that tells you what your child can actually do."
        image={IMAGES.classroom}
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Academic levels" title="Choose a section to explore" />
          <div className="mt-6">
            <Tabs tabs={PROGRAMS.map((p) => p.name)} active={tab} onChange={setTab} />
          </div>

          <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
            <div>
              <p className="text-[13px] font-semibold text-gold">{program.ages}</p>
              <h2 className="mt-1 font-heading text-[30px] font-bold heading-color">{program.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">{program.blurb}</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[14px] font-heading font-semibold heading-color mb-2.5">Teaching approach</h3>
                  <p className="text-[14px] leading-relaxed text-ink-muted dark:text-gray-400">{program.approach}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-heading font-semibold heading-color mb-2.5">Learning goals</h3>
                  <ul className="space-y-1.5">
                    {OUTCOMES.slice(0, 4).map((o) => (
                      <li key={o} className="flex gap-2 text-[13.5px] text-ink-muted dark:text-gray-400">
                        <CheckIcon size={15} className="mt-0.5 shrink-0 text-gold" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="text-[14px] font-heading font-semibold heading-color mb-3">Subjects</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {program.subjects.map((s) => (
                      <li key={s} className="rounded-full border border-surface-border dark:border-white/20 bg-surface-light dark:bg-white/5 px-2.5 py-1 text-[12.5px] text-ink-muted dark:text-gray-400">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-5">
                  <h3 className="text-[14px] font-heading font-semibold heading-color mb-3">Co-curricular</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {program.activities.map((s) => (
                      <li key={s} className="rounded-full border border-surface-border dark:border-white/20 bg-surface-light dark:bg-white/5 px-2.5 py-1 text-[12.5px] text-ink-muted dark:text-gray-400">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            <div>
              <img src={(IMAGES as any)[program.image]} alt={program.name} className="w-full aspect-[4/3] object-cover rounded-card" />
              <Card className="mt-6 p-5">
                <h3 className="text-[15px] font-heading font-semibold heading-color">Assessment approach</h3>
                <ul className="mt-3 space-y-3.5">
                  {ASSESSMENT.map((a) => (
                    <li key={a.title}>
                      <p className="text-[14px] font-medium text-ink dark:text-white">{a.title}</p>
                      <p className="text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400 mt-0.5">{a.body}</p>
                    </li>
                  ))}
                </ul>
              </Card>
              <Link to="/apply" className="mt-6 block">
                <Button full size="lg" className="rounded-full">
                  Apply to {program.name}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Learning outcomes" title="What a SALA Learner Leaves With" intro="By the end of Grade 6, every learner should be able to do the following — and we report against each of them." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex gap-3 rounded-card glass-card p-4">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-[14px] leading-relaxed text-white">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
