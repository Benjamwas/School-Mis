import React, { useState } from 'react';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';
import { PageHero } from './PageHero';

export function Contact() {
  const [sent, setSent] = useState(false);
  const { toast } = useApp();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ tone: 'success', title: 'Enquiry received', body: 'The admissions office will reply within one working day.' });
  };

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Contact"
        title="Talk to the school"
        intro="Admissions enquiries, transport routes, fees, or a question about your child — reach the right person directly." />
      

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-[1fr_1fr] gap-12">
        <div>
          <h2 className="font-serif text-[26px] text-ink">Send us a message</h2>
          <p className="mt-1.5 text-[14px] text-ink-muted">We reply to enquiries within one working day.</p>

          {sent &&
          <div className="mt-5">
              <Alert tone="success" title="Thank you — your message has been sent">
                A member of the admissions team will be in touch on the number you provided.
              </Alert>
            </div>
          }

          <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-5">
            <Field label="Full name" required>
              <Input required placeholder="Mercy Wairimu" />
            </Field>
            <Field label="Phone number" required>
              <Input required placeholder="+254 7XX XXX XXX" />
            </Field>
            <Field label="Email address" required className="sm:col-span-2">
              <Input type="email" required placeholder="you@example.com" />
            </Field>
            <Field label="What is your enquiry about?" className="sm:col-span-2">
              <Select defaultValue="Admissions">
                <option>Admissions</option>
                <option>Fees and payments</option>
                <option>Transport</option>
                <option>An existing learner</option>
                <option>Employment</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Message" required className="sm:col-span-2">
              <Textarea required placeholder="Tell us how we can help…" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg">
                Send enquiry
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">School office</h3>
            <ul className="mt-3 space-y-3 text-[14px] text-ink-muted">
              <li className="flex gap-3">
                <MapPinIcon size={17} className="mt-0.5 shrink-0 text-forest-700" />
                {SCHOOL.address}
              </li>
              <li className="flex gap-3">
                <PhoneIcon size={17} className="mt-0.5 shrink-0 text-forest-700" />
                <span>
                  {SCHOOL.phone}
                  <br />
                  {SCHOOL.altPhone}
                </span>
              </li>
              <li className="flex gap-3">
                <MailIcon size={17} className="mt-0.5 shrink-0 text-forest-700" />
                {SCHOOL.email}
              </li>
              <li className="flex gap-3">
                <ClockIcon size={17} className="mt-0.5 shrink-0 text-forest-700" />
                {SCHOOL.hours}
              </li>
            </ul>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="h-56 bg-forest-50 grid place-items-center text-[13px] text-ink-muted">Map of Kiambu Road campus</div>
            <div className="p-4 text-[13px] text-ink-muted">Visitor parking at the main gate. All visitors sign in at reception.</div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Who to contact</h3>
            <dl className="mt-3 divide-y divide-line text-[13.5px]">
              {[
              ['Admissions', 'Jane Njoki · admissions@salaschools.ac.ke'],
              ['Fees & payments', 'Peter Njoroge · finance@salaschools.ac.ke'],
              ['Transport', 'Transport office · +254 712 480 118'],
              ['Employment', 'Susan Muthoni · hr@salaschools.ac.ke']].
              map(([k, v]) =>
              <div key={k} className="py-2.5">
                  <dt className="font-medium text-ink">{k}</dt>
                  <dd className="text-ink-muted">{v}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </section>
    </div>);

}