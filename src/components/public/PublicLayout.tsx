import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, MenuIcon, PhoneIcon, XIcon, YoutubeIcon } from 'lucide-react';
import { Button, cx } from '../ui/primitives';
import { SalaMark } from '../ui/icons';
import { ToastStack } from '../ui/feedback';
import { PUBLIC_NAV, SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';

function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <SalaMark className="h-10 w-10 text-sm" />
            <span className="leading-tight">
              <span className="block font-serif text-[16px] font-semibold text-ink">St. Ann Lifred</span>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-muted">Academy Schools</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1" aria-label="Main">
            {PUBLIC_NAV.map((n) =>
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
              cx('px-3 py-2 text-[14px] rounded-md transition-colors duration-150', isActive ? 'text-forest-800 font-medium' : 'text-ink-muted hover:text-ink')
              }>
              
                {n.label}
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Portal login
              </Button>
            </Link>
            <Link to="/apply">
              <Button size="sm">Apply for admission</Button>
            </Link>
          </div>

          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="xl:hidden h-10 w-10 grid place-items-center rounded-lg border border-line">
            {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="xl:hidden overflow-hidden border-t border-line bg-white">
          
            <nav className="px-4 py-3 space-y-0.5" aria-label="Mobile">
              {PUBLIC_NAV.map((n) =>
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cx('block rounded-lg px-3 py-2.5 text-[15px]', isActive ? 'bg-forest-50 text-forest-800 font-medium' : 'text-ink')}>
              
                  {n.label}
                </NavLink>
            )}
              <div className="flex gap-2 pt-3">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="secondary" full size="sm">
                    Portal login
                  </Button>
                </Link>
                <Link to="/apply" className="flex-1" onClick={() => setOpen(false)}>
                  <Button full size="sm">
                    Apply now
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}

function SiteFooter() {
  const col = 'space-y-2 text-[13.5px] text-forest-100/80';
  const head = 'text-[12px] font-semibold uppercase tracking-[0.1em] text-gold-300 mb-3';
  return (
    <footer className="bg-forest-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <SalaMark tone="white" className="h-10 w-10 text-sm" />
              <span className="font-serif text-[17px]">St. Ann Lifred Academy Schools</span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-forest-100/80 max-w-sm">
              A Nairobi private school for ECD through Grade 6, educating children to learn with curiosity, grow in character and lead with integrity.
            </p>
            <div className="mt-5 flex gap-2">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((I, i) =>
              <a key={i} href="#" aria-label="Social link" className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-150">
                  <I size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className={head}>Explore</p>
            <ul className={col}>
              {PUBLIC_NAV.map((n) =>
              <li key={n.to}>
                  <Link to={n.to} className="hover:text-white transition-colors duration-150">
                    {n.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className={head}>Admissions</p>
            <ul className={col}>
              <li><Link to="/apply" className="hover:text-white">Apply online</Link></li>
              <li><Link to="/track" className="hover:text-white">Track an application</Link></li>
              <li><Link to="/visit" className="hover:text-white">Book a school visit</Link></li>
              <li><Link to="/admissions" className="hover:text-white">Fees & requirements</Link></li>
              <li><Link to="/login" className="hover:text-white">Parent portal</Link></li>
              <li><Link to="/login" className="hover:text-white">Student & staff login</Link></li>
            </ul>
          </div>

          <div>
            <p className={head}>Contact</p>
            <ul className={col}>
              <li className="flex gap-2"><MapPinIcon size={15} className="mt-0.5 shrink-0 text-gold-300" />{SCHOOL.address}</li>
              <li className="flex gap-2"><PhoneIcon size={15} className="mt-0.5 shrink-0 text-gold-300" />{SCHOOL.phone}</li>
              <li className="flex gap-2"><MailIcon size={15} className="mt-0.5 shrink-0 text-gold-300" />{SCHOOL.email}</li>
              <li className="text-forest-200">{SCHOOL.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-forest-200">
          <p>© 2026 St. Ann Lifred Academy Schools. All rights reserved.</p>
          <p>Registered with the Ministry of Education · Nairobi County</p>
        </div>
      </div>
    </footer>);

}

export function PublicLayout() {
  const { toasts, dismiss } = useApp();
  return (
    <div className="min-h-full w-full bg-white flex flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>);

}