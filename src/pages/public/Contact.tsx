import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  SendIcon
} from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { CONTACT_TOPICS, IMAGES, SCHOOL, WHATSAPP_URL } from '../../data/school';
import { PageHero } from './PageHero';
import { SchoolMap } from '../../components/public/SchoolMap';

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    topic: CONTACT_TOPICS[0],
    message: ''
  });

  const waLink = WHATSAPP_URL(
    `Hi ${SCHOOL.name}!\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n` +
    `Topic: ${form.topic}\n\n${form.message}`
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Contact"
        title="Talk To The School"
        intro="Admissions enquiries, transport routes, fees, or a question about your child — reach the right person directly. We reply within one working day."
        image={IMAGES.classroom}
        compact
        primaryCta="WhatsApp Us"
        primaryTo={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to speak to someone.`)}
        secondaryCta="Book a Visit"
        secondaryTo="/admissions"
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12">
          {/* Form */}
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <SendIcon size={12} className="text-gold" />
                Get in touch
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
                Send Us A Message
              </h2>
              <p className="mt-3 text-[14px] text-ink-muted dark:text-gray-400">
                Fill this in and we will either reply by email or open WhatsApp with your message pre-filled.
              </p>
            </motion.div>

            {sent && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                <Alert tone="success" title="Your enquiry is ready">
                  Continue on WhatsApp so we receive it instantly — or call us on {SCHOOL.phone}.
                </Alert>
              </motion.div>
            )}

            <form onSubmit={submit} className="mt-8 grid sm:grid-cols-2 gap-5">
              <motion.div {...fade}>
                <Field label="Full name" required>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Mercy Wairimu"
                    className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
                  />
                </Field>
              </motion.div>
              <motion.div {...fade}>
                <Field label="Phone number" required>
                  <Input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
                  />
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="Email address" required>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
                  />
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="What is your enquiry about?">
                  <Select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
                  >
                    {CONTACT_TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
              </motion.div>
              <motion.div {...fade} className="sm:col-span-2">
                <Field label="Message" required>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help…"
                    className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
                  />
                </Field>
              </motion.div>
              <div className="sm:col-span-2 space-y-3">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" size="lg" full className="rounded-full bg-navy-deep text-white hover:bg-navy-soft">
                    Prepare my enquiry
                  </Button>
                </motion.div>
                <a href={waLink} target="_blank" rel="noreferrer" className="block">
                  <Button type="button" variant="secondary" full className="rounded-full bg-[#25D366] text-white border-transparent hover:opacity-90">
                    <MessageCircleIcon size={16} />
                    Send on WhatsApp instead
                  </Button>
                </a>
                <p className="text-[12px] text-center text-ink-muted dark:text-gray-500">
                  Opens WhatsApp with your enquiry pre-filled · {SCHOOL.hours}
                </p>
              </div>
            </form>
          </div>

          {/* Info cards */}
          <div className="space-y-6">
            <motion.div {...fade}>
              <Card className="p-6 glass-card">
                <h3 className="font-heading text-[16px] font-bold text-ink dark:text-white">School Office</h3>
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

            <motion.a
              {...fade}
              href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I have a question.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-3xl bg-[#25D366] text-white p-5 hover:opacity-90 transition-opacity"
            >
              <span className="h-12 w-12 rounded-full bg-white/20 grid place-items-center shrink-0">
                <MessageCircleIcon size={22} />
              </span>
              <div>
                <p className="font-heading font-bold text-lg leading-tight text-white">Chat with us on WhatsApp</p>
                <p className="text-[13px] text-white/85 mt-0.5">Quick replies · usually within minutes during school hours</p>
              </div>
            </motion.a>

            <motion.div {...fade}>
              <Card className="p-0 overflow-hidden glass-card">
                <SchoolMap />
              </Card>
            </motion.div>

            <motion.div {...fade}>
              <Card className="p-6 glass-card">
                <h3 className="font-heading text-[16px] font-bold text-ink dark:text-white">Who To Contact</h3>
                <dl className="mt-4 divide-y divide-surface-border dark:divide-white/10 text-[13.5px]">
                  {[
                    ['Admissions', 'Jane Njoki · admissions@salaschools.ac.ke'],
                    ['Fees & payments', 'Peter Njoroge · finance@salaschools.ac.ke'],
                    ['Transport', 'Transport office · +254 712 480 118'],
                    ['Employment', 'Susan Muthoni · hr@salaschools.ac.ke']
                  ].map(([k, v]) => (
                    <div key={k} className="py-3">
                      <dt className="font-heading font-semibold text-ink dark:text-white">{k}</dt>
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
