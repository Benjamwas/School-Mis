import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  MessageCircleIcon,
  PhoneIcon
} from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea, cx } from '../../components/ui/primitives';
import {
  ADMISSION_REQUIREMENTS,
  ADMISSION_STEPS_SIMPLE,
  FAQS,
  FEE_STRUCTURE,
  IMAGES,
  PROGRAMS,
  SCHOOL,
  VISIT_REASONS,
  WHATSAPP_URL
} from '../../data/school';
import { formatKES } from '../../data/finance';
import { VISIT_SLOTS } from '../../data/crm';
import { PageHero } from './PageHero';
import { FloatingSchoolDecor } from '../../components/public/FloatingSchoolDecor';

const DATES = [
  { label: 'Applications open', value: '1 August 2026' },
  { label: 'Assessment days', value: 'Every Thursday, 9:00am' },
  { label: 'Offer letters released', value: 'Within 10 working days' },
  { label: 'Term 1 begins', value: '6 January 2027' }
];

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const }
};

function BookVisitForm() {
  const [day, setDay] = useState('24');
  const [slot, setSlot] = useState('10:00 am');
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    level: PROGRAMS[1].name,
    visitors: '2 adults',
    reason: VISIT_REASONS[0],
    notes: ''
  });

  const DAYS = [
    { date: '22', day: 'Mon', full: false },
    { date: '23', day: 'Tue', full: false },
    { date: '24', day: 'Wed', full: false },
    { date: '25', day: 'Thu', full: true },
    { date: '26', day: 'Fri', full: false },
    { date: '29', day: 'Mon', full: false },
    { date: '30', day: 'Tue', full: false }
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  const waLink = WHATSAPP_URL(
    `Hi ${SCHOOL.name}! I would like to book a school visit.\n\n` +
    `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n` +
    `Level of interest: ${form.level}\nDate: ${day} Sep 2026 at ${slot}\n` +
    `Visitors: ${form.visitors}\nReason: ${form.reason}\nNotes: ${form.notes}`
  );

  return (
    <Card className="p-0 overflow-hidden glass-card">
      <div className="bg-gradient-hero px-6 py-5">
        <h3 className="font-display text-[22px] font-bold text-white flex items-center gap-2">
          <CalendarDaysIcon size={20} className="text-gold" />
          Book a School Visit
        </h3>
        <p className="mt-1 text-[13px] text-white/70">
          Tours run on school days so you see a normal morning — not a staged one.
        </p>
      </div>

      {booked ? (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <span className="h-12 w-12 shrink-0 rounded-full bg-gold/15 text-gold grid place-items-center">
              <CheckCircle2Icon size={26} />
            </span>
            <div className="flex-1">
              <h4 className="font-display text-[22px] font-bold text-ink dark:text-white">Your Visit Request Is Ready</h4>
              <p className="mt-1 text-[14px] text-ink-muted dark:text-gray-400">
                Confirm on WhatsApp and our admissions team will lock in your slot.
              </p>
              <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Date', `${day} September 2026`],
                  ['Time', slot],
                  ['Level', form.level],
                  ['Visitors', form.visitors],
                  ['Parent', form.name || '—'],
                  ['Phone', form.phone || '—']
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] text-ink-muted dark:text-gray-400">{k}</dt>
                    <dd className="text-[14px] font-medium text-ink dark:text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={waLink} target="_blank" rel="noreferrer">
                  <Button className="rounded-full bg-[#25D366] text-white hover:opacity-90">
                    <MessageCircleIcon size={16} />
                    Confirm on WhatsApp
                  </Button>
                </a>
                <Button variant="secondary" onClick={() => setBooked(false)} className="rounded-full">
                  Edit booking
                </Button>
                <Link to="/apply">
                  <Button variant="ghost">Start an Application</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="p-5 sm:p-6 space-y-6">
          <div>
            <h4 className="text-[14px] font-heading font-semibold text-ink dark:text-white flex items-center gap-2 mb-3">
              <CalendarDaysIcon size={16} className="text-gold" /> Choose a date — September 2026
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  disabled={d.full}
                  onClick={() => setDay(d.date)}
                  aria-pressed={day === d.date}
                  className={cx(
                    'rounded-xl border py-2.5 text-center transition-colors duration-150',
                    d.full && 'opacity-40 cursor-not-allowed',
                    day === d.date
                      ? 'border-gold bg-gold/12 text-gold'
                      : 'border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink dark:text-white hover:border-gold'
                  )}
                >
                  <span className="block text-[10px] uppercase text-ink-muted dark:text-gray-400">{d.day}</span>
                  <span className="block text-[15px] font-semibold">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-heading font-semibold text-ink dark:text-white flex items-center gap-2 mb-3">
              <ClockIcon size={16} className="text-gold" /> Available times
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VISIT_SLOTS.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSlot(s.time)}
                  aria-pressed={slot === s.time}
                  className={cx(
                    'rounded-xl border py-2.5 text-[13px] font-medium transition-colors duration-150',
                    !s.available && 'opacity-40 cursor-not-allowed line-through',
                    slot === s.time
                      ? 'border-gold bg-gold/12 text-gold'
                      : 'border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink dark:text-white hover:border-gold'
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 border-t border-surface-border dark:border-white/10 pt-6">
            <Field label="Parent / guardian name" required>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              />
            </Field>
            <Field label="Phone number" required>
              <Input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+254 7XX XXX XXX"
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              />
            </Field>
            <Field label="Email address">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              />
            </Field>
            <Field label="Programme of interest" required>
              <Select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              >
                {PROGRAMS.map((p) => (
                  <option key={p.slug}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Number of visitors">
              <Select
                value={form.visitors}
                onChange={(e) => setForm({ ...form, visitors: e.target.value })}
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              >
                <option>1 adult</option>
                <option>2 adults</option>
                <option>2 adults + child</option>
                <option>Family (4+)</option>
              </Select>
            </Field>
            <Field label="Reason for your visit">
              <Select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              >
                {VISIT_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Anything we should know?" className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Transport route, questions about fees, accessibility needs…"
                className="bg-white dark:bg-white/5 dark:border-white/20 dark:text-white"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <Button type="submit" size="lg" full className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft shadow-yellow">
              Request visit for {day} Sep at {slot}
            </Button>
            <a href={waLink} target="_blank" rel="noreferrer" className="block">
              <Button type="button" variant="secondary" full className="rounded-full">
                <MessageCircleIcon size={16} className="text-accent-whatsapp" />
                Or send this request on WhatsApp
              </Button>
            </a>
            <p className="text-[12px] text-center text-ink-muted dark:text-gray-500">
              We reply within one working day · {SCHOOL.phone}
            </p>
          </div>
        </form>
      )}
    </Card>
  );
}

export function Admissions() {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);

  return (
    <div className="w-full">
      <PageHero
        eyebrow="Admissions"
        title="Joining SALA, Made Simple"
        intro="Places for the January 2027 intake are open from Playgroup through Grade 9. Book a visit, apply online, and we will guide you the rest of the way."
        image={IMAGES.hero}
        primaryCta="Book a Visit"
        primaryTo="/visit"
        secondaryCta="Start Application"
        secondaryTo="/apply"
      />

      {/* Steps */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto">
            <span className="pill mb-4 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              How it works
            </span>
            <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
              Four Steps From First Call To First Day
            </h2>
            <p className="mt-4 text-[15px] text-ink-muted dark:text-gray-400">
              No complicated process. Book a visit, apply, get assessed, and enrol — we stay with you
              the whole way.
            </p>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADMISSION_STEPS_SIMPLE.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-3xl p-6 hover-lift relative overflow-hidden"
              >
                <span className="font-display text-5xl font-bold text-gold/20 absolute top-4 right-5 select-none">{s.step}</span>
                <h3 className="font-heading text-[17px] font-bold heading-color">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available places + requirements */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-navy-deep section-on-navy">
        <div className="absolute inset-0 gradient-mesh opacity-35" />
        <FloatingSchoolDecor variant="navy" density="high" seed={ 11 } />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
          <div>
            <motion.div {...fade}>
              <span className="pill mb-4 inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Available places
              </span>
              <h2 className="font-display text-[30px] sm:text-[38px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Where We Currently Have Space
              </h2>
            </motion.div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {PROGRAMS.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-4"
                >
                  <p className="text-[12px] font-semibold text-gold uppercase tracking-wider">{p.stage}</p>
                  <p className="mt-1 text-[15px] font-heading font-bold text-white">{p.name}</p>
                  <p className="mt-1 text-[12.5px] text-white/60">{p.ages}</p>
                  <p className="mt-2 text-[13px] text-white/75">
                    <span className="font-semibold text-gold">{[14, 12, 9, 11, 7, 6][i]}</span> places available
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div {...fade} className="mt-8">
              <h3 className="font-display text-[22px] font-bold text-gold mb-4">Termly fees at a glance</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] glass rounded-2xl text-sm overflow-hidden">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Level', 'Tuition', 'Transport', 'Meals', 'Total / term'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gold text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_STRUCTURE.map((f) => (
                      <tr key={f.level} className="border-t border-white/8 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-heading font-semibold text-white">{f.level}</td>
                        <td className="px-4 py-3 text-white/60 tabular-nums">{formatKES(f.tuition)}</td>
                        <td className="px-4 py-3 text-white/60 tabular-nums">{formatKES(f.transport)}</td>
                        <td className="px-4 py-3 text-white/60 tabular-nums">{formatKES(f.meals)}</td>
                        <td className="px-4 py-3 font-semibold text-gold tabular-nums">{formatKES(f.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[12px] text-white/50">
                A one-off admission fee of {formatKES(25000)} applies to new learners. Instalment plans available.
              </p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div {...fade}>
              <Card className="p-6 glass">
                <h3 className="font-heading text-[16px] font-bold text-white">What you need</h3>
                <ul className="mt-4 space-y-2.5">
                  {ADMISSION_REQUIREMENTS.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[13px] text-white/75">
                      <CheckIcon size={15} className="mt-0.5 shrink-0 text-gold" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div {...fade}>
              <Card className="p-6 glass">
                <h3 className="font-heading text-[16px] font-bold text-white">Important dates</h3>
                <dl className="mt-4 divide-y divide-white/10">
                  {DATES.map((d) => (
                    <div key={d.label} className="flex justify-between gap-4 py-3">
                      <dt className="text-[13px] text-white/60">{d.label}</dt>
                      <dd className="text-[13px] font-semibold text-white text-right">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </motion.div>

            <motion.div {...fade}>
              <Card className="p-6 bg-gradient-yellow text-navy-deep border-none">
                <h3 className="font-heading text-[16px] font-bold text-navy-deep">Ready when you are</h3>
                <p className="mt-2 text-[13.5px] text-navy-deep/80">
                  Applications take about fifteen minutes. Or start with a visit — most families do.
                </p>
                <div className="mt-5 space-y-2.5">
                  <Link to="/apply">
                    <Button full className="rounded-full bg-navy-deep text-white hover:bg-navy-800">
                      Start Application
                    </Button>
                  </Link>
                  <a
                    href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to start an application.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button type="button" variant="secondary" full className="rounded-full border-navy-deep/20 bg-transparent text-navy-deep hover:bg-navy-deep/5">
                      <MessageCircleIcon size={15} />
                      WhatsApp Admissions
                    </Button>
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book visit form */}
      <section id="book-visit" className="relative py-16 lg:py-20 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-10">
            <span className="pill mb-4 inline-flex">
              <CalendarDaysIcon size={12} className="text-gold" />
              Visit us
            </span>
            <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
              Book a Personal School Tour
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400">
              Meet the teachers, see the classrooms in session, walk the campus and ask everything.
              No pressure — just warmth.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-[13px] text-ink-muted dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <PhoneIcon size={14} className="text-gold" /> {SCHOOL.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={14} className="text-gold" /> {SCHOOL.hours}
              </span>
            </div>
          </motion.div>

          <motion.div {...fade}>
            <BookVisitForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
          <motion.div {...fade}>
            <span className="pill mb-4 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              FAQs
            </span>
            <h2 className="font-display text-[32px] sm:text-[42px] font-bold heading-color leading-[1.1] tracking-[-0.02em]">
              Questions We Are Asked Most
            </h2>
            <p className="mt-4 text-[14px] text-ink-muted dark:text-gray-400">
              Still unsure? Call us or send a WhatsApp — we are happy to talk it through.
            </p>
            <a
              href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I have a question about admissions.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex"
            >
              <Button className="rounded-full bg-[#25D366] text-white hover:opacity-90">
                <MessageCircleIcon size={16} />
                Ask on WhatsApp
              </Button>
            </a>
          </motion.div>

          <ul className="divide-y divide-surface-border dark:divide-white/10 border-y border-surface-border dark:border-white/10">
            {FAQS.map((f, i) => {
              const on = open === f.q;
              return (
                <motion.li
                  key={f.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => setOpen(on ? null : f.q)}
                    aria-expanded={on}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span className="text-[15px] font-heading font-semibold heading-color group-hover:text-gold transition-colors duration-200">
                      {f.q}
                    </span>
                    <ChevronDownIcon
                      size={18}
                      className={cx(
                        'shrink-0 text-ink-muted dark:text-gray-400 transition-transform duration-300 ease-sala',
                        on && 'rotate-180 text-gold'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pb-5 text-[14px] leading-relaxed text-ink-muted dark:text-gray-400 max-w-2xl overflow-hidden"
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
