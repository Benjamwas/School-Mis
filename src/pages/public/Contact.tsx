import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';
import { PageHero } from './PageHero';
import { SchoolMap } from '../../components/public/SchoolMap';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }
};

export function Contact() {
  const [sent, setSent] = useState(false);
  const { toast, darkMode } = useApp();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ tone: 'success', title: 'Enquiry received', body: 'The admissions office will reply within one working day.' });
  };

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Contact"
        title="Talk To The School"
        intro="Admissions enquiries, transport routes, fees, or a question about your child — reach the right person directly."
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1fr] gap-12">
          <div>
            <motion.div {...fade}>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider">
                <span className="w-8 h-[2px] bg-gold" />
                Get In Touch
              </span>
              <h2 className="font-heading text-[32px] sm:text-[42px] font-black heading-color leading-[1.1]">
                Send Us A Message
              </h2>
              <p className="mt-3 text-[14px] text-ink-muted dark:text-gray-400">We reply to enquiries within one working day.</p>
            </motion.div>

            {sent && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <Alert tone="success" title="Thank you — your message has been sent">
                  A member of the admissions team will be in touch on the number you provided.
                </Alert>
              </motion.div>
            )}

            <form onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-5">
              <motion.div {...fade}>
                <Field label="Full name" required>
                  <Input required placeholder="Mercy Wairimu" className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white" />
                </Field>
              </motion.div>
              <motion.div {...fade}>
                <Field label="Phone number" required>
                  <Input required placeholder="+254 7XX XXX XXX" className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white" />
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="Email address" required>
                  <Input type="email" required placeholder="you@example.com" className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white" />
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="What is your enquiry about?">
                  <Select defaultValue="Admissions" className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white">
                    <option>Admissions</option>
                    <option>Fees and payments</option>
                    <option>Transport</option>
                    <option>An existing learner</option>
                    <option>Employment</option>
                    <option>Other</option>
                  </Select>
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="Message" required>
                  <Textarea required placeholder="Tell us how we can help…" className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white" />
                </Field>
              </motion.div>
              <div className="sm:col-span-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" size="lg" className="rounded-full btn-glow">
                    Send Enquiry
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <motion.div {...fade}>
              <Card className="p-6 glass-card">
                <h3 className="font-heading text-[16px] font-bold heading-color">School Office</h3>
                <ul className="mt-4 space-y-4 text-[14px] text-ink-muted dark:text-gray-400">
                  <li className="flex gap-3">
                    <MapPinIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                    {SCHOOL.address}
                  </li>
                  <li className="flex gap-3">
                    <PhoneIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      {SCHOOL.phone}
                      <br />
                      {SCHOOL.altPhone}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <MailIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                    {SCHOOL.email}
                  </li>
                  <li className="flex gap-3">
                    <ClockIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                    {SCHOOL.hours}
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div {...fade}>
              <Card className="p-0 overflow-hidden glass-card">
                <SchoolMap compact />
                <div className="p-4 text-[13px] text-ink-muted dark:text-gray-400">Visitor parking at the main gate. All visitors sign in at reception.</div>
              </Card>
            </motion.div>

            <motion.div {...fade}>
              <Card className="p-6 glass-card">
                <h3 className="font-heading text-[16px] font-bold heading-color">Who To Contact</h3>
                <dl className="mt-4 divide-y divide-surface-border dark:divide-white/10 text-[13.5px]">
                  {[
                    ['Admissions', 'Jane Njoki · admissions@salaschools.ac.ke'],
                    ['Fees & payments', 'Peter Njoroge · finance@salaschools.ac.ke'],
                    ['Transport', 'Transport office · +254 712 480 118'],
                    ['Employment', 'Susan Muthoni · hr@salaschools.ac.ke']
                  ].map(([k, v]) => (
                    <div key={k} className="py-3">
                      <dt className="font-heading font-semibold heading-color">{k}</dt>
                      <dd className="text-ink-muted dark:text-gray-400 mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
