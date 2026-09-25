import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Button, Card, Checkbox, Field, Input } from '../../components/ui/primitives';
import { Icon, SalaMark } from '../../components/ui/icons';
import { ROLE_HOME, ROLE_LABELS, ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';
import { mapRole } from '../../api/types';
import type { Role } from '../../types';

/** Demo accounts seeded by `manage.py seed_demo`. */
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
{ role: 'hr', icon: 'Briefcase' }];


export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sunrise.ac.ke');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInAs = async (r: Role) => {
    setError(null);
    const creds = DEMO_CREDS[r];
    if (!creds) {
      setError(`No demo account for this role.`);
      return;
    }
    setBusy(true);
    try {
      const me = await login(creds.email, creds.password);
      navigate(ROLE_HOME[mapRole(me.roles ?? []) ?? 'admin']);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void signInAs('admin');
  };

  const busyLabel = busy ? 'Signing in…' : 'Sign in';

  return (
    <div className="w-full bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <div>
          <SalaMark className="h-12 w-12 text-base" />
          <h1 className="mt-5 font-serif text-[34px] leading-tight text-ink">Sign in to the SALA portal</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted max-w-md">
            One account for parents, learners and staff. Your role determines what you see — attendance and fees for parents, lessons for learners, classes and
            HR for teachers.
          </p>

          <Card className="mt-8 p-6">
            <form
              className="space-y-5"
              onSubmit={submit}>

              <Field label="Email or phone number" required>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password" required>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>

              {error &&
              <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-[13px] text-red-700">
                  {error}
                </p>
              }

              <div className="flex items-center justify-between">
                <Checkbox label="Keep me signed in" defaultChecked />
                <button type="button" className="text-[13px] font-medium text-forest-700 hover:underline">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" size="lg" full disabled={busy}>
                {busyLabel}
              </Button>
              <p className="text-[12px] text-ink-soft">
                Demo account: <code className="text-forest-700">admin@sunrise.ac.ke</code> / <code className="text-forest-700">password123</code>
              </p>
            </form>
          </Card>
        </div>

        <Card className="p-6">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-600">Live demo</p>
          <h2 className="mt-1.5 font-serif text-[24px] text-ink">Sign in with a demo role</h2>
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Logs you into a real seeded account — one per role, all sharing the password <code className="text-forest-700">password123</code>.
          </p>
          <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
            {QUICK.map((q) =>
            <li key={q.role}>
                <button
                disabled={busy}
                onClick={() => signInAs(q.role)}
                className="w-full text-left rounded-lg border border-line bg-white p-3.5 hover:border-forest-300 hover:bg-forest-50/40 transition-colors duration-150 group disabled:opacity-60">

                  <span className="flex items-center gap-2.5">
                    <span className="h-9 w-9 rounded-lg bg-forest-50 text-forest-700 grid place-items-center shrink-0">
                      <Icon name={q.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-medium text-ink">{ROLE_LABELS[q.role]}</span>
                      <span className="block text-[12px] text-ink-muted truncate">{ROLE_USERS[q.role].name}</span>
                    </span>
                    <ArrowRightIcon size={15} className="text-ink-soft group-hover:text-forest-700 transition-colors duration-150" />
                  </span>
                </button>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}