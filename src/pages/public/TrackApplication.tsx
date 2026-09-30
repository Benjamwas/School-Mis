import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, ArrowRightIcon, FileTextIcon, SearchIcon } from 'lucide-react';
import { Button, Card, Field, Input, StatusBadge } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { Timeline } from '../../components/ui/data';
import { APPLICATION_TIMELINE } from '../../data/crm';
import { api, ApiError } from '../../api/client';

export function TrackApplication() {
  const [found, setFound] = useState(true);
  const [ref, setRef] = useState('APP-2026-0418');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState<{application_number: string;status: string;applicant_name: string;grade_level: string} | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const track = async () => {
    setBusy(true);
    setMessage('');
    try {
      const result = await api.get<typeof details>(`/public/admissions/track/?application_number=${encodeURIComponent(ref)}&contact=${encodeURIComponent(contact)}`);
      setDetails(result);
      setFound(true);
    } catch (error) {
      setFound(false);
      setMessage(error instanceof ApiError ? error.message : 'We could not find that application.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold">Admissions</p>
        <h1 className="mt-2 font-heading text-[32px] sm:text-[40px] leading-tight font-bold heading-color">Track Your Application</h1>
        <p className="mt-2 text-[15px] text-ink-muted dark:text-gray-400">Enter the application number from your confirmation email to see exactly where things stand.</p>

        <Card className="mt-8 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <Field label="Application number" className="flex-1">
              <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="APP-2026-0000" />
            </Field>
            <Field label="Parent phone or email" className="flex-1">
              <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone or email used on the application" />
            </Field>
            <Button icon={<SearchIcon size={16} />} onClick={() => void track()} disabled={busy || !ref.trim() || !contact.trim()} className="rounded-full">
              {busy ? 'Searching…' : 'Track'}
            </Button>
          </div>
        </Card>

        {!found ? (
          <div className="mt-6">
            <Alert tone="error" title="We couldn't find that application">
              {message || 'Check the reference and contact details from your confirmation email.'} Call the admissions office on +254 712 480 115 if you need help.
            </Alert>
          </div>
        ) : (
          <div className="mt-6 grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-surface-border dark:border-white/10">
                <div>
                  <p className="text-[13px] text-ink-muted dark:text-gray-400">Application {details?.application_number || ref}</p>
                  <h2 className="font-heading text-[24px] font-bold heading-color mt-0.5">{details?.applicant_name || 'Application'} · {details?.grade_level || 'Admissions'}</h2>
                  <p className="text-[13px] text-ink-muted dark:text-gray-400 mt-1">Live application status · January 2027 intake</p>
                </div>
                <StatusBadge status={details?.status || 'Interview'} />
              </div>

              <div className="mt-6">
                <Timeline
                  items={APPLICATION_TIMELINE.map((t) => ({
                    title: t.stage,
                    meta: t.date,
                    body: t.desc,
                    state: t.state as 'complete' | 'active' | 'pending'
                  }))}
                />
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-5 border-gold/50 bg-gold/5">
                <div className="flex gap-3">
                  <AlertTriangleIcon size={18} className="mt-0.5 text-gold shrink-0" />
                  <div>
                    <p className="text-[14px] font-heading font-semibold heading-color">Action needed</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">
                      Bring Mark's original birth certificate and last school report to the assessment on Thursday 26 September at 9:00am, Acacia Wing reception.
                    </p>
                    <Button size="sm" className="mt-3 rounded-full">
                      Confirm attendance
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-[15px] font-heading font-semibold heading-color">Your Documents</h3>
                <ul className="mt-3 space-y-2.5">
                  {[
                    ['Birth certificate', 'Verified'],
                    ['Previous school report', 'Verified'],
                    ['Passport photograph', 'Pending']
                  ].map(([name, status]) => (
                    <li key={name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-[13.5px] text-ink dark:text-white">
                        <FileTextIcon size={15} className="text-ink-soft dark:text-gray-500" />
                        {name}
                      </span>
                      <StatusBadge status={status} />
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" full className="mt-4 rounded-full">
                  Upload missing document
                </Button>
              </Card>

              <Card className="p-5">
                <h3 className="text-[15px] font-heading font-semibold heading-color">Need to talk to someone?</h3>
                <p className="mt-1.5 text-[13.5px] text-ink-muted dark:text-gray-400">Jane Njoki is handling your application.</p>
                <div className="mt-3 space-y-2">
                  <Link to="/contact">
                    <Button variant="secondary" size="sm" full icon={<ArrowRightIcon size={15} />} className="rounded-full">
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
        )}
      </div>
    </div>
  );
}
