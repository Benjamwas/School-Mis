import { Suspense, lazy, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/** Lazy-loaded 6000ms emoji page loader (infinite pattern) */
const PageLoader = lazy(() => import('./PageLoader'));
import {
  ArrowUpRightIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  MenuIcon,
  MessageCircleIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  XIcon,
  YoutubeIcon
} from 'lucide-react';
import { Button, cx } from '../ui/primitives';
import { SalaMark } from '../ui/icons';
import { ToastStack } from '../ui/feedback';
import { FOOTER_NAV, PUBLIC_NAV, SCHOOL, WHATSAPP_URL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-sala',
          scrolled
            ? 'bg-transparent'
            : 'bg-transparent'
        )}
      >
        {/* Always-on soft navy scrim — keeps the header transparent but readable */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-navy-deep/75 via-navy-deep/35 to-transparent" />
        <div className={cx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-500',
          scrolled ? 'bg-white/15 opacity-100' : 'opacity-0'
        )} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-[72px] sm:h-[80px] items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setOpen(false)}>
              <motion.div
                whileHover={{ rotate: 8, scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <SalaMark tone="white" className="h-11 w-11 text-sm" />
              </motion.div>
              <span className="leading-tight">
                <span className="block font-heading text-[15px] font-bold text-white group-hover:text-gold transition-colors duration-300 tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                  ST. ANN LIFRED
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gold/90 mt-0.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
                  Academy Schools · Est. 2002
                </span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
              {PUBLIC_NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) => cx(
                      'relative px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 rounded-full',
                      isActive
                        ? 'text-navy-deep bg-gradient-yellow shadow-yellow'
                        : 'text-white/85 hover:text-navy-deep hover:bg-white/95 hover:shadow-soft'
                    )}
                  >
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-soft"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </motion.button>

              <Link
                to={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to ask about admissions.`)}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-white/30 bg-white/20 backdrop-blur text-[12.5px] font-semibold text-white hover:bg-accent-whatsapp hover:border-accent-whatsapp transition-all duration-300 shadow-soft"
              >
                <MessageCircleIcon size={14} className="text-accent-whatsapp" />
                WhatsApp
              </Link>

              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-navy-deep hover:bg-white rounded-full px-3 backdrop-blur border border-transparent hover:border-white/40"
                >
                  Portal
                </Button>
              </Link>

              <Link to="/admissions">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-yellow px-5 text-navy-deep font-bold hover:scale-105 shadow-yellow transition-transform duration-300 btn-glow"
                  >
                    Book a Visit
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </motion.button>

              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="h-9 w-9 grid place-items-center rounded-full bg-gradient-yellow text-navy-deep border border-white/30 hover:scale-105 transition-transform duration-300 shadow-yellow"
              >
                {open ? <XIcon size={17} /> : <MenuIcon size={17} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] xl:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 h-full w-[min(320px,85vw)] bg-navy-deep flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/8">
                <div className="flex items-center gap-2.5">
                  <SalaMark tone="white" className="h-9 w-9 text-xs" />
                  <div>
                    <p className="font-heading font-bold text-white text-sm leading-none">ST. ANN LIFRED</p>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/50 mt-0.5">Academy Schools</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 grid place-items-center rounded-full bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                  aria-label="Close menu"
                >
                  <XIcon size={16} />
                </button>
              </div>

              <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto" aria-label="Mobile">
                {PUBLIC_NAV.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <NavLink
                      to={n.to}
                      end={n.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => cx(
                        'flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gold text-navy-deep'
                          : 'text-white/70 hover:text-white hover:bg-white/8'
                      )}
                    >
                      {n.label}
                      <ArrowUpRightIcon size={14} className="opacity-40" />
                    </NavLink>
                  </motion.div>
                ))}

                <div className="pt-4 mt-2 border-t border-white/8 space-y-1">
                  {FOOTER_NAV.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-2.5 text-[14px] text-white/55 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      {n.label}
                    </NavLink>
                  ))}
                </div>
              </nav>

              <div className="px-6 pb-8 space-y-3 border-t border-white/8 pt-6">
                <Link to="/admissions" onClick={() => setOpen(false)} className="block">
                  <Button full className="rounded-full bg-gold text-navy-deep font-semibold hover:bg-gold-soft">
                    Book a School Visit
                  </Button>
                </Link>
                <a
                  href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to know more about admissions.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 font-semibold text-white hover:bg-white/12 transition-colors text-sm"
                >
                  <MessageCircleIcon size={16} className="text-accent-whatsapp" />
                  Chat on WhatsApp
                </a>
                <Link to="/login" onClick={() => setOpen(false)} className="block text-center text-[13px] text-white/55 hover:text-gold transition-colors">
                  Parent / Student portal login
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SiteFooter() {
  const col = 'space-y-2 text-[13.5px] text-white/65';
  const head = 'text-[11px] font-bold uppercase tracking-[0.18em] text-gold mb-4';

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[800px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 gradient-mesh opacity-25 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <SalaMark tone="white" className="h-11 w-11 text-sm" />
              <div>
                <p className="font-heading text-[15px] font-bold text-white leading-tight">St. Ann Lifred Academy Schools</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold mt-0.5">{SCHOOL.est}</p>
              </div>
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-white/65 max-w-sm">
              A Nairobi school for Playgroup through Grade 9 — educating children to learn with curiosity,
              grow in character and lead with integrity.
            </p>
            <p className="mt-3 font-heading italic text-gold text-[14px]">“{SCHOOL.motto}”</p>
            <div className="mt-5 flex gap-2">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((I, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-navy-deep transition-all duration-300"
                >
                  <I size={16} />
                </motion.a>
              ))}
              <motion.a
                href={WHATSAPP_URL(`Hi ${SCHOOL.name}!`)}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                whileHover={{ scale: 1.1, y: -2 }}
                className="h-10 w-10 grid place-items-center rounded-full bg-accent-whatsapp/20 text-accent-whatsapp hover:bg-accent-whatsapp hover:text-white transition-all duration-300"
              >
                <MessageCircleIcon size={16} />
              </motion.a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className={head}>Explore</p>
            <ul className={col}>
              {PUBLIC_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-gold transition-colors duration-200 inline-flex items-center gap-1">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={head}>More</p>
            <ul className={col}>
              {FOOTER_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-gold transition-colors duration-200">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/apply" className="hover:text-gold transition-colors duration-200">Apply online</Link></li>
              <li><Link to="/track" className="hover:text-gold transition-colors duration-200">Track application</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors duration-200">Portal login</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className={head}>Visit & Contact</p>
            <ul className={col}>
              <li className="flex gap-2.5"><MapPinIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.address}</li>
              <li className="flex gap-2.5"><PhoneIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.phone} · {SCHOOL.altPhone}</li>
              <li className="flex gap-2.5"><MailIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.email}</li>
              <li className="text-white/55">{SCHOOL.hours}</li>
            </ul>
            <a
              href={WHATSAPP_URL(`Hi ${SCHOOL.name}! I would like to book a school visit.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <MessageCircleIcon size={15} />
              WhatsApp the school
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-semibold">
            <p>Montessori-inspired early years · CBC · Est. 2002</p>
            <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FIRST_VISIT_KEY = 'sala_first_visit_shown';

export function PublicLayout() {
  const { toasts, dismiss } = useApp();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // First-visit homepage loader only (4.5s, education emojis, infinite pattern)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (location.pathname !== '/') return;

    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(FIRST_VISIT_KEY) === '1'
        || window.localStorage.getItem(FIRST_VISIT_KEY) === '1';
    } catch {
      alreadyShown = false;
    }

    if (alreadyShown) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      window.sessionStorage.setItem(FIRST_VISIT_KEY, '1');
      window.localStorage.setItem(FIRST_VISIT_KEY, '1');
    } catch {
      /* ignore storage errors */
    }

    const t = window.setTimeout(() => setLoading(false), 4500);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="min-h-full w-full bg-surface-light dark:bg-navy-dark flex flex-col transition-colors duration-300">
      <Suspense fallback={null}>
        <PageLoader show={loading} duration={4500} />
      </Suspense>
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="flex-1 pt-[72px] sm:pt-[80px]"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
