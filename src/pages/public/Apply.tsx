import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, CheckIcon, FileUpIcon, PaperclipIcon, XIcon } from 'lucide-react';
import { Button, Card, Checkbox, Field, Input, Select, Textarea, cx } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { useApp } from '../../contexts/AppContext';

const STEPS = ['Student', 'Parent/Guardian', 'Emergency contact', 'Documents', 'Additional info', 'Review', 'Confirmation'];

const DOCS = [
{ name: 'Birth certificate', required: true },
{ name: 'Previous school report', required: true },
{ name: 'Passport photograph', required: true },
{ name: 'Immunisation record', required: false }];


export function Apply() {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState<string[]>(['Birth certificate']);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    firstName: 'Mark',
    lastName: 'Otieno',
    dob: '2016-04-18',
    gender: 'Male',
    currentSchool: 'Riverside Junior School',
    applyingClass: 'Grade 4',
    lastGrade: 'Grade 3 — average 71%',
    parentName: 'George Otieno',
    relationship: 'Father',
    phone: '+254 733 118 440',
    email: 'g.otieno@gmail.com',
    occupation: 'Procurement Officer',
    address: 'Garden Estate, Nairobi',
    emergencyName: 'Everline Otieno',
    emergencyRelationship: 'Mother',
    emergencyPhone: '+254 711 908 442',
    medical: 'Mild asthma — carries an inhaler. No known allergies.',
    notes: 'Mark is keen to join the chess club and the swimming squad.'
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const navigate = useNavigate();
  const { toast } = useApp();

  const next = () => {
    if (step === 0 && !form.firstName.trim()) {
      setError(true);
      return;
    }
    setError(false);
    if (step === 5) toast({ tone: 'success', title: 'Application submitted', body: 'Reference APP-2026-0418. A confirmation email is on the way.' });
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDoc = (name: string) => setUploaded((u) => u.includes(name) ? u.filter((d) => d !== name) : [...u, name]);

  return (
    <div className="w-full bg-cream min-h-full">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        <div className="mb-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-600">Online application · January 2027 intake</p>
          <h1 className="mt-2 font-serif text-[32px] sm:text-[40px] leading-tight text-ink">Apply to St. Ann Lifred Academy</h1>
          <p className="mt-2 text-[15px] text-ink-muted">Step {step + 1} of {STEPS.length} — {STEPS[step]}. Your progress is saved as you go.</p>
        </div>

        {/* Stepper */}
        <ol className="mb-8 flex gap-1.5 overflow-x-auto sala-scroll pb-1">
          {STEPS.map((s, i) =>
          <li key={s} className="flex-1 min-w-[96px]">
              <div className={cx('h-1.5 rounded-full transition-colors duration-200', i < step ? 'bg-forest-600' : i === step ? 'bg-gold-400' : 'bg-line')} />
              <p className={cx('mt-2 text-[11.5px] leading-tight', i === step ? 'text-ink font-medium' : 'text-ink-muted')}>{s}</p>
            </li>
          )}
        </ol>

        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
          <Card className="p-6 sm:p-8">
            {error &&
            <div className="mb-5">
                <Alert tone="error" title="Please check the highlighted fields">The learner’s first name is required before you can continue.</Alert>
              </div>
            }

            {step === 0 &&
            <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Learner first name" required>
                  <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={cx(error && !form.firstName && 'border-red-400')} />
                </Field>
                <Field label="Learner surname" required>
                  <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                </Field>
                <Field label="Date of birth" required>
                  <Input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                </Field>
                <Field label="Gender" required>
                  <Select value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                  </Select>
                </Field>
                <Field label="Current school" hint="Leave blank if applying to PP1">
                  <Input value={form.currentSchool} onChange={(e) => set('currentSchool', e.target.value)} />
                </Field>
                <Field label="Class applying for" required>
                  <Select value={form.applyingClass} onChange={(e) => set('applyingClass', e.target.value)}>
                    {['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map((c) =>
                  <option key={c}>{c}</option>
                  )}
                  </Select>
                </Field>
                <Field label="Previous academic performance" className="sm:col-span-2">
                  <Textarea value={form.lastGrade} onChange={(e) => set('lastGrade', e.target.value)} />
                </Field>
              </div>
            }

            {step === 1 &&
            <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name" required>
                  <Input value={form.parentName} onChange={(e) => set('parentName', e.target.value)} />
                </Field>
                <Field label="Relationship to learner" required>
                  <Select value={form.relationship} onChange={(e) => set('relationship', e.target.value)}>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                  </Select>
                </Field>
                <Field label="Phone number" required hint="Format: +254 7XX XXX XXX">
                  <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </Field>
                <Field label="Email address" required>
                  <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                </Field>
                <Field label="Occupation">
                  <Input value={form.occupation} onChange={(e) => set('occupation', e.target.value)} />
                </Field>
                <Field label="Home address" required>
                  <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
                </Field>
              </div>
            }

            {step === 2 &&
            <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Emergency contact name" required>
                  <Input value={form.emergencyName} onChange={(e) => set('emergencyName', e.target.value)} />
                </Field>
                <Field label="Relationship" required>
                  <Input value={form.emergencyRelationship} onChange={(e) => set('emergencyRelationship', e.target.value)} />
                </Field>
                <Field label="Phone number" required>
                  <Input value={form.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} />
                </Field>
                <Field label="Alternative phone">
                  <Input placeholder="+254 7XX XXX XXX" />
                </Field>
                <div className="sm:col-span-2">
                  <Checkbox label="This person is authorised to collect the learner from school." defaultChecked />
                </div>
              </div>
            }

            {step === 3 &&
            <div className="space-y-4">
                <p className="text-[14px] text-ink-muted">Upload a clear photograph or scan of each document. PDF, JPG or PNG up to 5MB.</p>
                {DOCS.map((d) => {
                const done = uploaded.includes(d.name);
                return (
                  <div key={d.name} className={cx('flex items-center gap-4 rounded-lg border p-4 transition-colors duration-150', done ? 'border-forest-200 bg-forest-50/60' : 'border-dashed border-line bg-white')}>
                      <span className={cx('h-10 w-10 grid place-items-center rounded-lg shrink-0', done ? 'bg-forest-100 text-forest-700' : 'bg-cream text-ink-muted')}>
                        {done ? <CheckIcon size={18} /> : <FileUpIcon size={18} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-ink">
                          {d.name} {d.required && <span className="text-red-600">*</span>}
                        </p>
                        <p className="text-[12.5px] text-ink-muted truncate">{done ? `${d.name.toLowerCase().replace(/ /g, '-')}.pdf · 412 KB` : 'No file selected'}</p>
                      </div>
                      <Button variant={done ? 'ghost' : 'secondary'} size="sm" onClick={() => toggleDoc(d.name)} icon={done ? <XIcon size={15} /> : <PaperclipIcon size={15} />}>
                        {done ? 'Remove' : 'Upload'}
                      </Button>
                    </div>);

              })}
                <Alert tone="info" title="Missing a document?">You can submit now and upload the rest from your application tracker within 7 days.</Alert>
              </div>
            }

            {step === 4 &&
            <div className="space-y-5">
                <Field label="Medical information" hint="Allergies, conditions, medication or anything the school nurse should know.">
                  <Textarea value={form.medical} onChange={(e) => set('medical', e.target.value)} />
                </Field>
                <Field label="Previous school information" hint="Reason for transfer, any support the learner received.">
                  <Textarea placeholder="Relocating from Riverside Junior School due to a change of residence." />
                </Field>
                <Field label="Anything else we should know?">
                  <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                </Field>
                <Checkbox label="I consent to SALA contacting my child’s current school for a reference." defaultChecked />
              </div>
            }

            {step === 5 &&
            <div className="space-y-6">
                {[
              { title: 'Student information', rows: [['Full name', `${form.firstName} ${form.lastName}`], ['Date of birth', form.dob], ['Gender', form.gender], ['Current school', form.currentSchool], ['Applying for', form.applyingClass]] },
              { title: 'Parent / guardian', rows: [['Name', form.parentName], ['Relationship', form.relationship], ['Phone', form.phone], ['Email', form.email], ['Address', form.address]] },
              { title: 'Emergency contact', rows: [['Name', form.emergencyName], ['Relationship', form.emergencyRelationship], ['Phone', form.emergencyPhone]] },
              { title: 'Documents', rows: [['Uploaded', uploaded.join(', ') || 'None'], ['Outstanding', DOCS.filter((d) => !uploaded.includes(d.name)).map((d) => d.name).join(', ') || 'None']] },
              { title: 'Additional information', rows: [['Medical', form.medical], ['Notes', form.notes]] }].
              map((section) =>
              <div key={section.title}>
                    <h3 className="text-[14px] font-semibold text-ink mb-2">{section.title}</h3>
                    <dl className="rounded-lg border border-line divide-y divide-line">
                      {section.rows.map(([k, v]) =>
                  <div key={k} className="grid sm:grid-cols-[180px_1fr] gap-1 px-4 py-2.5">
                          <dt className="text-[13px] text-ink-muted">{k}</dt>
                          <dd className="text-[13.5px] text-ink">{v}</dd>
                        </div>
                  )}
                    </dl>
                  </div>
              )}
                <Checkbox label="I confirm the information above is accurate and complete." defaultChecked />
              </div>
            }

            {step === 6 &&
            <div className="text-center py-6">
                <span className="mx-auto h-14 w-14 rounded-full bg-forest-50 text-forest-700 grid place-items-center">
                  <CheckCircle2Icon size={30} />
                </span>
                <h2 className="mt-4 font-serif text-[28px] text-ink">Application submitted</h2>
                <p className="mt-2 text-[15px] text-ink-muted max-w-md mx-auto">
                  Thank you, {form.parentName.split(' ')[0]}. We have received {form.firstName}’s application for {form.applyingClass}.
                </p>
                <dl className="mt-6 mx-auto max-w-md rounded-lg border border-line divide-y divide-line text-left">
                  {[
                ['Application number', 'APP-2026-0418'],
                ['Date submitted', '20 September 2026'],
                ['Assessment date', 'Thursday 26 September, 9:00am'],
                ['Expected decision', 'Within 10 working days']].
                map(([k, v]) =>
                <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                      <dt className="text-[13px] text-ink-muted">{k}</dt>
                      <dd className="text-[13.5px] font-medium text-ink">{v}</dd>
                    </div>
                )}
                </dl>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={() => navigate('/track')}>Track this application</Button>
                  <Link to="/visit">
                    <Button variant="secondary">Book a school visit</Button>
                  </Link>
                </div>
                <p className="mt-6 text-[13px] text-ink-muted">A confirmation email has been sent to {form.email}.</p>
              </div>
            }

            {step < 6 &&
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Back
                </Button>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[12.5px] text-ink-muted">Saved just now</span>
                  <Button onClick={next}>{step === 5 ? 'Submit application' : 'Continue'}</Button>
                </div>
              </div>
            }
          </Card>
        </motion.div>
      </div>
    </div>);

}