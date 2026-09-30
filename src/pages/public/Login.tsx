import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Button, Card, Checkbox, Field, Input } from '../../components/ui/primitives';
import { Icon, SalaMark } from '../../components/ui/icons';
import { ROLE_HOME, ROLE_LABELS, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';
import { ApiError } from '../../api/client';
import { mapRole } from '../../api/types';
import type { Role } from '../../types';

const DEMO_CREDS: Partial<Record<Role, { email: string; password: string }>> = {
  parent: { email: 'parent1@sunrise.ac.ke', password: 'password123' },
  student: { email: 'student1@sunrise.ac.ke', password: 'password123' },
  classteacher: { email: 'classteacher@sunrise.ac.ke', password: 'password123' },
  subjectteacher: { email: 'subjectteacher@sunrise.ac.ke', password: 'password123' },
  admin: { email: 'admin@sunrise.ac.ke', password: 'password123' },
  superadmin: { email: 'superadmin@sunrise.ac.ke', password: 'password123' },
  finance: { email: 'finance@sunrise.ac.ke', password: 'password123' },
  hr: { email: 'hr@sunrise.ac.ke', password: 'password123' },
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
        setError('Cannot reach the SALA API. Is the backend running on port 8000?');
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
    <div className="w-full min-h-screen">
      <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <div>
          <SalaMark className="h-12 w-12 text-base" />
          <h1 className="mt-5 font-heading text-[34px] leading-tight font-bold heading-color">
            Sign In To The SALA Portal
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted dark:text-gray-400 max-w-md">
            One account for parents, learners and staff. Your role determines what you see — attendance and fees for parents, lessons for learners, classes and
            HR for teachers.
          </p>

          <Card className="mt-8 p-6">
            <form className="space-y-5" onSubmit={submit}>
              <Field label="Email or phone number" required>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password" required>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>

              {error && (
                <p className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-[13px] text-red-700 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Checkbox label="Keep me signed in" defaultChecked />
                <button type="button" className="text-[13px] font-medium text-gold hover:text-gold-dark transition-colors duration-200">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" size="lg" full disabled={busy} className="rounded-full">
                {busyLabel}
              </Button>
              <p className="text-[12px] text-ink-soft dark:text-gray-500">
                Demo account: <code className="text-gold">admin@sunrise.ac.ke</code> / <code className="text-gold">password123</code>
              </p>
            </form>
          </Card>
        </div>

        <Card className="p-6">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold">Live demo</p>
          <h2 className="mt-2 font-heading text-[24px] font-bold heading-color">Sign In With A Demo Role</h2>
          <p className="mt-2 text-[14px] text-ink-muted dark:text-gray-400">
            Logs you into a real seeded account — one per role, all sharing the password <code className="text-gold">password123</code>.
          </p>
          <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
            {QUICK.map((q, i) => (
              <motion.li 
                key={q.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  disabled={busy}
                  onClick={() => signInAs(q.role)}
                  className="w-full text-left rounded-xl border border-surface-border dark:border-white/20 bg-white dark:bg-white/5 p-3.5 hover:border-gold hover:bg-gold/5 dark:hover:bg-gold/10 transition-all duration-200 group disabled:opacity-60"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-9 w-9 rounded-lg bg-gold/10 text-gold grid place-items-center shrink-0">
                      <Icon name={q.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-heading font-semibold heading-color">{ROLE_LABELS[q.role]}</span>
                      <span className="block text-[12px] text-ink-muted dark:text-gray-400 truncate">{ROLE_USERS[q.role].name}</span>
                    </span>
                    <ArrowRightIcon size={15} className="text-ink-soft dark:text-gray-500 group-hover:text-gold transition-colors duration-200" />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
