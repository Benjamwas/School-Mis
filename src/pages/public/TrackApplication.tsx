import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangleIcon, ArrowRightIcon, FileTextIcon, SearchIcon } from 'lucide-react';
import { Button, Card, Field, Input, StatusBadge } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { Timeline } from '../../components/ui/data';
import { APPLICATION_TIMELINE } from '../../data/crm';

export function TrackApplication() {
  const [found, setFound] = useState(true);
  const [ref, setRef] = useState('APP-2026-0418');

  return (
    <div className="w-full bg-cream min-h-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-600">Admissions</p>
        <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] leading-tight text-ink">Track your application</h1>
        <p className="mt-2 text-[15px] text-ink-muted">Enter the application number from your confirmation email to see exactly where things stand.</p>

        <Card className="mt-8 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <Field label="Application number" className="flex-1">
              <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="APP-2026-0000" />
            </Field>
            <Field label="Parent phone or email" className="flex-1">
              <Input defaultValue="+254 733 118 440" />
            </Field>
            <Button icon={<SearchIcon size={16} />} onClick={() => setFound(ref.trim().toUpperCase().startsWith('APP'))}>
              Track
            </Button>
          </div>
        </Card>

        {!found ?
        <div className="mt-6">
            <Alert tone="error" title="We couldn’t find that application">
              Check the reference in your confirmation email, or call the admissions office on +254 712 480 115 and we will look it up for you.
            </Alert>
          </div> :

        <div className="mt-6 grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-line">
                <div>
                  <p className="text-[13px] text-ink-muted">Application {ref}</p>
                  <h2 className="font-serif text-[24px] text-ink mt-0.5">Mark Otieno · Grade 4</h2>
                  <p className="text-[13px] text-ink-muted mt-1">Submitted 16 September 2026 · January 2027 intake</p>
                </div>
                <StatusBadge status="Interview" />
              </div>

              <div className="mt-6">
                <Timeline
                items={APPLICATION_TIMELINE.map((t) => ({
                  title: t.stage,
                  meta: t.date,
                  body: t.desc,
                  state: t.state as 'complete' | 'active' | 'pending'
                }))} />
              
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-5 border-gold-200 bg-gold-50">
                <div className="flex gap-3">
                  <AlertTriangleIcon size={18} className="mt-0.5 text-gold-600 shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-ink">Action needed</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                      Bring Mark’s original birth certificate and last school report to the assessment on Thursday 26 September at 9:00am, Acacia Wing reception.
                    </p>
                    <Button size="sm" className="mt-3">
                      Confirm attendance
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-[15px] font-semibold text-ink">Your documents</h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                ['Birth certificate', 'Verified'],
                ['Previous school report', 'Verified'],
                ['Passport photograph', 'Pending']].
                map(([name, status]) =>
                <li key={name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[13.5px] text-ink">
                        <FileTextIcon size={15} className="text-ink-soft" />
                        {name}
                      </span>
                      <StatusBadge status={status} />
                    </li>
                )}
                </ul>
                <Button variant="secondary" size="sm" full className="mt-4">
                  Upload missing document
                </Button>
              </Card>

              <Card className="p-5">
                <h3 className="text-[15px] font-semibold text-ink">Need to talk to someone?</h3>
                <p className="mt-1.5 text-[13.5px] text-ink-muted">Jane Njoki is handling your application.</p>
                <div className="mt-3 space-y-2">
                  <Link to="/contact">
                    <Button variant="secondary" size="sm" full icon={<ArrowRightIcon size={15} />}>
                      Contact admissions
                    </Button>
                  </Link>
                  <Link to="/visit">
                    <Button variant="ghost" size="sm" full>
                      Book a school visit
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        }
      </div>
    </div>);

}