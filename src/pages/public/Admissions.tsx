import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon, FileTextIcon } from 'lucide-react';
import { Button, Card, SectionTitle, cx } from '../../components/ui/primitives';
import { ADMISSION_REQUIREMENTS, ADMISSION_STEPS, FAQS, FEE_STRUCTURE, IMAGES, PROGRAMS } from '../../data/school';
import { formatKES } from '../../data/finance';
import { PageHero } from './PageHero';

const DATES = [
{ label: 'Applications open', value: '1 August 2026' },
{ label: 'Assessment days', value: 'Every Thursday, 9:00am' },
{ label: 'Offer letters released', value: 'Within 10 working days' },
{ label: 'Commitment fee deadline', value: '30 November 2026' },
{ label: 'Term 1 begins', value: '6 January 2027' }];


export function Admissions() {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Admissions"
        title="Joining SALA, step by step"
        intro="Places for the January 2027 intake are open across ECD, Lower Primary and Upper Primary. Here is exactly what to expect, what it costs and how long it takes."
        image={IMAGES.hero} />
      

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
          <div>
            <SectionTitle eyebrow="The process" title="Five stages from first call to first day" />
            <ol className="mt-8 space-y-6">
              {ADMISSION_STEPS.map((s) =>
              <li key={s.step} className="flex gap-5">
                  <span className="font-serif text-[22px] text-gold-400 w-8 shrink-0">{s.step}</span>
                  <div className="border-b border-line pb-6 flex-1">
                    <h3 className="text-[16px] font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
                  </div>
                </li>
              )}
            </ol>

            <div className="mt-12">
              <SectionTitle eyebrow="Available places" title="Where we currently have space" />
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                {PROGRAMS.map((p, i) =>
                <Card key={p.slug} className="p-4">
                    <p className="text-[13px] font-medium text-gold-600">{p.ages.split('·')[1]}</p>
                    <p className="mt-1 text-[15px] font-semibold text-ink">{p.name}</p>
                    <p className="mt-2 text-[13.5px] text-ink-muted">{[14, 9, 6][i]} places available</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Requirements</h3>
              <ul className="mt-3 space-y-2">
                {ADMISSION_REQUIREMENTS.map((r) =>
                <li key={r} className="flex gap-2.5 text-[13.5px] text-ink-muted">
                    <CheckIcon size={15} className="mt-0.5 shrink-0 text-forest-600" />
                    {r}
                  </li>
                )}
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Important dates</h3>
              <dl className="mt-3 divide-y divide-line">
                {DATES.map((d) =>
                <div key={d.label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-[13.5px] text-ink-muted">{d.label}</dt>
                    <dd className="text-[13.5px] font-medium text-ink text-right">{d.value}</dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card className="p-5 bg-forest-800 border-forest-800 text-white">
              <h3 className="text-[15px] font-semibold">Ready to apply?</h3>
              <p className="mt-1.5 text-[13.5px] text-forest-100/90">Seven short steps, about fifteen minutes. Your progress is saved automatically.</p>
              <div className="mt-4 space-y-2">
                <Link to="/apply">
                  <Button variant="gold" full>
                    Start application
                  </Button>
                </Link>
                <Link to="/visit">
                  <Button variant="secondary" full className="bg-white/10 text-white border-white/25 hover:bg-white/15">
                    Book a school visit
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-cream border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <SectionTitle eyebrow="Fees" title="Termly fees for 2027" intro="All figures are per term in Kenyan Shillings. Transport and lunch are optional. Instalment plans are available by arrangement with the finance office." />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] bg-white border border-line rounded-card text-sm overflow-hidden">
              <thead>
                <tr className="bg-forest-50 text-left">
                  {['Level', 'Tuition', 'Transport', 'Meals', 'Total per term'].map((h) =>
                  <th key={h} className="px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-forest-700">
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {FEE_STRUCTURE.map((f) =>
                <tr key={f.level} className="border-t border-line">
                    <td className="px-5 py-3.5 font-medium text-ink">{f.level}</td>
                    <td className="px-5 py-3.5 text-ink-muted tabular-nums">{formatKES(f.tuition)}</td>
                    <td className="px-5 py-3.5 text-ink-muted tabular-nums">{formatKES(f.transport)}</td>
                    <td className="px-5 py-3.5 text-ink-muted tabular-nums">{formatKES(f.meals)}</td>
                    <td className="px-5 py-3.5 font-semibold text-ink tabular-nums">{formatKES(f.total)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12.5px] text-ink-muted flex items-center gap-2">
            <FileTextIcon size={14} /> A one-off admission fee of {formatKES(25000)} applies to new learners.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <SectionTitle eyebrow="FAQs" title="Questions we are asked most" />
        <ul className="divide-y divide-line border-y border-line">
          {FAQS.map((f) => {
            const on = open === f.q;
            return (
              <li key={f.q}>
                <button onClick={() => setOpen(on ? null : f.q)} aria-expanded={on} className="w-full flex items-center justify-between gap-4 py-4 text-left">
                  <span className="text-[15px] font-medium text-ink">{f.q}</span>
                  <ChevronDownIcon size={18} className={cx('shrink-0 text-ink-muted transition-transform duration-200 ease-sala', on && 'rotate-180')} />
                </button>
                {on && <p className="pb-4 -mt-1 text-[14px] leading-relaxed text-ink-muted max-w-2xl">{f.a}</p>}
              </li>);

          })}
        </ul>
      </section>
    </div>);

}