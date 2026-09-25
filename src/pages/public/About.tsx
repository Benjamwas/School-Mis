import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../../components/ui/primitives';
import { Timeline } from '../../components/ui/data';
import { IMAGES, LEADERSHIP, TIMELINE, VALUES } from '../../data/school';
import { PageHero } from './PageHero';

export function About() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="About the school"
        title="A school built one classroom at a time"
        intro="From nineteen children in a converted family home to 1,148 learners on a six-acre Kiambu Road campus — the same conviction has carried us the whole way."
        image={IMAGES.library} />
      

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
        <div>
          <SectionTitle eyebrow="Our story" title="Founded by a teacher, still run like a classroom" />
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-muted">
            <p>
              Dr. Ann Lifred Mwangi started SALA in 2002 after fifteen years teaching in public primary schools. She had one rule for the new school: no child
              would be allowed to fall behind quietly. Every decision since — small classes, specialist teachers from Grade 4, a personalised learning profile
              for every learner — comes back to that rule.
            </p>
            <p>
              Today SALA educates children from PP1 through Grade 6 across three sections, with an academic team of 86. We are fully aligned to the
              competency-based curriculum and report on it honestly: parents see the topics their child has mastered and the ones needing work, in the same view.
            </p>
            <p>
              We are deliberately a primary school. Our job is to hand junior secondary a child who can read for meaning, reason with numbers, work with others,
              and speak up — and who still likes school.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="font-serif text-[20px] text-ink">Our vision</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                To be Kenya’s most trusted primary school — where academic excellence and personal character are pursued with equal seriousness.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-serif text-[20px] text-ink">Our mission</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                To provide every learner with a safe, joyful and rigorous education, delivered by excellent teachers in genuine partnership with families.
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <img src={IMAGES.classroom} alt="A Grade 3 lesson in progress" className="w-full aspect-[4/3] object-cover rounded-card" />
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Educational philosophy</h3>
            <ul className="mt-3 space-y-3 text-[14px] leading-relaxed text-ink-muted">
              <li><span className="font-medium text-ink">Mastery before pace.</span> We do not move on because the term does.</li>
              <li><span className="font-medium text-ink">Evidence, not impressions.</span> Every judgement about a child is backed by work we can show you.</li>
              <li><span className="font-medium text-ink">Warmth with structure.</span> Clear expectations are a form of kindness.</li>
              <li><span className="font-medium text-ink">Parents as partners.</span> You should never be surprised by a report card.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-cream border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <SectionTitle eyebrow="Core values" title="Five things we will not compromise on" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v, i) =>
            <div key={v.title} className="border-t-2 border-gold-300 pt-4">
                <span className="text-[12px] font-semibold text-gold-600">0{i + 1}</span>
                <h3 className="mt-1 text-[16px] font-semibold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{v.body}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-14">
        <div>
          <SectionTitle eyebrow="Our history" title="Milestones" />
          <div className="mt-8">
            <Timeline
              items={TIMELINE.map((t) => ({ title: t.title, meta: t.year, body: t.body, state: 'complete' as const }))} />
            
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Leadership" title="The people accountable for your child’s school" />
          <ul className="mt-8 divide-y divide-line border-t border-line">
            {LEADERSHIP.map((l) =>
            <li key={l.name} className="py-4">
                <p className="text-[15px] font-semibold text-ink">{l.name}</p>
                <p className="text-[13px] text-gold-600 font-medium">{l.role}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{l.note}</p>
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-forest-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-[28px] sm:text-[34px] leading-tight">Student wellbeing & parent partnership</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-forest-100/90 max-w-2xl">
              A full-time nurse, two trained counsellors, a no-tolerance bullying policy and a class teacher who calls you before small things become large ones.
              Parents meet teachers formally three times a year, and informally whenever they need to.
            </p>
          </div>
          <div className="flex items-end">
            <Link to="/visit" className="w-full">
              <Button variant="gold" size="lg" full>
                Come and see for yourself
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);

}