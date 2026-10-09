import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, MessageCircleIcon } from 'lucide-react';
import { Button, Card, Checkbox, Field, Input } from '../../components/ui/primitives';
import { Icon, SalaMark } from '../../components/ui/icons';
import { ROLE_HOME, ROLE_LABELS, ROLE_USERS } from '../../data/navigation';
import { SCHOOL, WHATSAPP_URL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';
import { ApiError } from '../../api/client';
import { mapRole } from '../../api/types';
import type { Role } from '../../types';

const FloatingIcons = lazy(() => import('../../components/public/FloatingIcons'));

const DEMO_CREDS: Partial<Record<Role, { email: string; password: string }>> = {
  parent: { email: 'parent1@sunrise.ac.ke', password: 'password123' },
  student: { email: 'student1@sunrise.ac.ke', password: 'password123' },
  classteacher: { email: 'classteacher@sunrise.ac.ke', password: 'password123' },
  subjectteacher: { email: 'subjectteacher@sunrise.ac.ke', password: 'password123' },
  admin: { email: 'admin@sunrise.ac.ke', password: 'password123' },
  superadmin: { email: 'superadmin@sunrise.ac.ke', password: 'password123' },
  finance: { email: 'finance@sunrise.ac.ke', password: 'password123' },
  hr: { email: 'hr@sunrise.ac.ke', password: 'password123' }
};

const QUICK: { role: Role; icon: string }[] = [
  { role: 'parent', icon: 'Users' },
  { role: 'student', icon: 'GraduationCap' },
  { role: 'classteacher', icon: 'School' },
  { role: 'subjectteacher', icon: 'BookOpen' },
  { role: 'admin', icon: 'Settings' },
  { role: 'superadmin', icon: 'ShieldCheck' },
  { role: 'finance', icon: 'Wallet' },
  { role: 'hr', icon: 'Briefcase' }
];

export function Login() {
  const { login, logout } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sunrise.ac.ke');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async (creds: { email: string; password: string }) => {
    setError(null);
    setBusy(true);
    try {
      const me = await login(creds.email, creds.password);
      const mapped = mapRole(me.roles ?? []);
      if (!mapped) {
        await logout();
        setError('This account is valid but has no portal role assigned. Contact your administrator.');
        return;
      }
      navigate(ROLE_HOME[mapped], { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError('Incorrect email or password.');
      } else if (e instanceof ApiError && e.status === 0) {
        setError('Cannot reach the SALA API.');
      } else {
        setError(e instanceof Error ? e.message : 'Sign-in failed.');
      }
    } finally {
      setBusy(false);
    }
  };

  const signInAs = (r: Role) => {
    const creds = DEMO_CREDS[r];
    if (!creds) {
      setError('No demo account for this role.');
      return;
    }
    void authenticate(creds);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || !password) {
      setError('Enter your email and password.');
      return;
    }
    void authenticate({ email: address, password });
  };

  const busyLabel = busy ? 'Signing in…' : 'Sign in';

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Moving navy gradient background */}
      <div className="absolute inset-0 bg-gradient-hero animate-gradient bg-[length:400%_400%]" />
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      {/* Floating education icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <FloatingIcons density="medium" seed={7} variant="navy" />
        </Suspense>
      </div>

      {/* Blobs */}
      <div className="absolute top-20 right-[12%] h-64 w-64 rounded-full bg-gold/15 blur-3xl blob pointer-events-none" />
      <div className="absolute bottom-32 left-[6%] h-48 w-48 rounded-full bg-gold/10 blur-3xl blob pointer-events-none" style={{ animationDelay: '-6s' }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
        {/* Left: brand + form */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <SalaMark tone="white" className="h-12 w-12 text-base" />
            <div>
              <p className="font-heading text-[16px] font-bold text-white leading-tight">St. Ann Lifred</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">Academy Schools</p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-8 font-display text-[34px] sm:text-[42px] leading-[1.1] font-bold text-white tracking-[-0.02em]"
          >
            Sign In To The{' '}
            <span className="text-gradient-yellow">SALA Portal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-[15px] leading-relaxed text-white/70 max-w-md"
          >
            One account for parents, learners and staff. Your role determines what you see.
          </motion.p>

          {/* Form card — white so black text is easy to see */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <Card className="mt-8 p-6 shadow-elevated">
              <form className="space-y-5" onSubmit={submit}>
                <Field label="Email or phone number" required>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white text-black placeholder:text-gray-400" />
                </Field>
                <Field label="Password" required>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white text-black placeholder:text-gray-400" />
                </Field>

                {error && (
                  <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-[13px] text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <Checkbox label="Keep me signed in" defaultChecked />
                  <button type="button" className="text-[13px] font-medium text-gold hover:text-gold-dark transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" size="lg" full disabled={busy} className="rounded-full bg-navy-deep text-white hover:bg-navy-soft font-semibold">
                  {busyLabel}
                </Button>
                <p className="text-[12px] text-ink-muted text-center">
                  Demo: <code className="text-gold font-semibold">admin@sunrise.ac.ke</code> / <code className="text-gold font-semibold">password123</code>
                </p>
              </form>
            </Card>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I need help signing in.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white transition-colors"
          >
            <MessageCircleIcon size={15} className="text-accent-whatsapp" />
            Trouble signing in? Message us
          </motion.a>
        </div>

        {/* Right: demo roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
        >
          <Card className="p-6 shadow-elevated">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold">Live demo</p>
            <h2 className="mt-2 font-display text-[24px] font-bold text-black">Sign In With A Demo Role</h2>
            <p className="mt-2 text-[14px] text-ink-muted">
              One seeded account per role — all share password <code className="text-gold font-semibold">password123</code>.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
              {QUICK.map((q, i) => (
                <motion.li
                  key={q.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <button
                    disabled={busy}
                    onClick={() => signInAs(q.role)}
                    className="w-full text-left rounded-xl border border-surface-border bg-white p-3.5 hover:border-gold hover:bg-gold/5 transition-all duration-200 group disabled:opacity-60"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="h-9 w-9 rounded-lg bg-gold/15 text-gold-dark grid place-items-center shrink-0">
                        <Icon name={q.icon} size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-heading font-semibold text-black">{ROLE_LABELS[q.role]}</span>
                        <span className="block text-[12px] text-ink-muted truncate">{ROLE_USERS[q.role].name}</span>
                      </span>
                      <ArrowRightIcon size={15} className="text-ink-soft group-hover:text-gold transition-colors duration-200" />
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
