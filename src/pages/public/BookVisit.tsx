import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, CheckCircle2Icon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { Button, Card, Field, Input, Select, Textarea, cx } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { VISIT_SLOTS } from '../../data/crm';
import { SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';
import { SchoolMap } from '../../components/public/SchoolMap';

const DAYS = [
  { date: '22', day: 'Mon', full: false },
  { date: '23', day: 'Tue', full: false },
  { date: '24', day: 'Wed', full: false },
  { date: '25', day: 'Thu', full: true },
  { date: '26', day: 'Fri', full: false },
  { date: '29', day: 'Mon', full: false },
  { date: '30', day: 'Tue', full: false }
];

export function BookVisit() {
  const [day, setDay] = useState('24');
  const [slot, setSlot] = useState('10:00 am');
  const [booked, setBooked] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { toast } = useApp();

  const confirmBooking = () => {
    setConfirm(false);
    setBooked(true);
    toast({ tone: 'success', title: 'Visit booked', body: `Wednesday ${day} September at ${slot}. Reference V-3084.` });
  };

  return (
    <div className="w-full min-h-screen">
      <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold">Visit us</p>
        <h1 className="mt-2 font-heading text-[32px] sm:text-[40px] leading-tight font-bold heading-color">Book a School Visit</h1>
        <p className="mt-2 text-[15px] text-ink-muted dark:text-gray-400 max-w-2xl">
          Tours run on school days so you see a normal morning, not a staged one. You will meet the section head and visit classrooms in session.
        </p>

        {booked ? (
          <Card className="mt-8 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <span className="h-12 w-12 shrink-0 rounded-full bg-gold/10 text-gold grid place-items-center">
                <CheckCircle2Icon size={26} />
              </span>
              <div className="flex-1">
                <h2 className="font-heading text-[24px] font-bold heading-color">Your Visit Is Confirmed</h2>
                <p className="mt-1 text-[14px] text-ink-muted dark:text-gray-400">Reference V-3084 · A reminder SMS will be sent the day before.</p>
                <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    ['Date', `Wednesday ${day} September 2026`],
                    ['Time', slot],
                    ['Visitors', '2 adults'],
                    ['Meeting point', 'Acacia Wing reception'],
                    ['Host', 'Peter Mwaura, Admissions'],
                    ['Duration', 'About 60 minutes']
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[12.5px] text-ink-muted dark:text-gray-400">{k}</dt>
                      <dd className="text-[14px] font-medium text-ink dark:text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link to="/apply">
                    <Button className="rounded-full">Start an Application</Button>
                  </Link>
                  <Button variant="secondary" onClick={() => setBooked(false)} className="rounded-full">
                    Reschedule
                  </Button>
                  <Button variant="ghost" onClick={() => setBooked(false)}>
                    Cancel booking
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="mt-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-heading font-semibold heading-color flex items-center gap-2">
                <CalendarDaysIcon size={17} className="text-gold" /> Choose a date — September 2026
              </h2>
              <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d.date}
                    disabled={d.full}
                    onClick={() => setDay(d.date)}
                    aria-pressed={day === d.date}
                    className={cx(
                      'rounded-lg border py-2.5 text-center transition-colors duration-150',
                      d.full && 'opacity-40 cursor-not-allowed',
                      day === d.date ? 'border-gold bg-gold/10 text-gold' : 'border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink dark:text-white hover:border-gold'
                    )}
                  >
                    <span className="block text-[11px] uppercase text-ink-muted dark:text-gray-400">{d.day}</span>
                    <span className="block text-[16px] font-semibold">{d.date}</span>
                  </button>
                ))}
              </div>

              <h3 className="mt-7 text-[15px] font-heading font-semibold heading-color flex items-center gap-2">
                <ClockIcon size={17} className="text-gold" /> Available times
              </h3>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VISIT_SLOTS.map((s) => (
                  <button
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => setSlot(s.time)}
                    aria-pressed={slot === s.time}
                    className={cx(
                      'rounded-lg border py-2.5 text-[13.5px] font-medium transition-colors duration-150',
                      !s.available && 'opacity-40 cursor-not-allowed line-through',
                      slot === s.time ? 'border-gold bg-gold/10 text-gold' : 'border-surface-border dark:border-white/20 bg-white dark:bg-white/5 text-ink dark:text-white hover:border-gold'
                    )}
                  >
                    {s.time}
                  </button>
                ))}
              </div>

              <div className="mt-7 grid sm:grid-cols-2 gap-5 border-t border-surface-border dark:border-white/10 pt-6">
                <Field label="Parent / guardian name" required>
                  <Input defaultValue="Fatuma Ali" />
                </Field>
                <Field label="Number of visitors" required>
                  <Select defaultValue="2 adults">
                    <option>1 adult</option>
                    <option>2 adults</option>
                    <option>2 adults + child</option>
                    <option>Family (4+)</option>
                  </Select>
                </Field>
                <Field label="Phone number" required>
                  <Input defaultValue="+254 700 552 331" />
                </Field>
                <Field label="Email address" required>
                  <Input type="email" defaultValue="f.ali@gmail.com" />
                </Field>
                <Field label="Reason for your visit" className="sm:col-span-2">
                  <Textarea defaultValue="Considering Grade 1 for January 2027. Would like to see the early years classrooms and ask about transport from Parklands." />
                </Field>
              </div>

              <Button size="lg" full className="mt-6 rounded-full" onClick={() => setConfirm(true)}>
                Confirm visit for {day} Sep at {slot}
              </Button>
            </Card>

            <div className="space-y-6">
              <Card className="p-5">
                <h3 className="text-[15px] font-heading font-semibold heading-color">What a Visit Includes</h3>
                <ul className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">
                  <li>A walk through classrooms in session</li>
                  <li>Time with the head of your child's section</li>
                  <li>The library, maker space, field and dining hall</li>
                  <li>Fees, transport routes and the school day explained</li>
                  <li>Questions — as many as you have</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h3 className="text-[15px] font-heading font-semibold heading-color flex items-center gap-2">
                  <MapPinIcon size={16} className="text-gold" /> Finding Us
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted dark:text-gray-400">{SCHOOL.address}</p>
                <div className="mt-3"><SchoolMap compact /></div>
                <p className="mt-3 text-[13px] text-ink-muted dark:text-gray-400 flex items-center gap-2">
                  <UsersIcon size={15} className="text-gold" /> Visitor parking is available at the main gate.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={confirmBooking}
        title="Confirm your school visit"
        body={`We will hold Wednesday ${day} September 2026 at ${slot} for 2 visitors. You can reschedule or cancel any time from your confirmation email.`}
        confirmLabel="Confirm booking"
      />
    </div>
  );
}
