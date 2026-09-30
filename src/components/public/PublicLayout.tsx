import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, MenuIcon, MoonIcon, PhoneIcon, SunIcon, XIcon, YoutubeIcon } from 'lucide-react';
import { Button, cx } from '../ui/primitives';
import { SalaMark } from '../ui/icons';
import { ToastStack } from '../ui/feedback';
import { PUBLIC_NAV, SCHOOL } from '../../data/school';
import { useApp } from '../../contexts/AppContext';

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled 
        ? 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl shadow-lg' 
        : 'bg-white/70 dark:bg-navy-900/70 backdrop-blur-md'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[80px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <SalaMark className="h-12 w-12 text-sm" />
            </motion.div>
            <span className="leading-tight">
              <span className="block font-heading text-[15px] font-bold text-navy dark:text-white tracking-wide group-hover:text-gold transition-colors duration-300">
                ST. ANN LIFRED
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">
                Academy Schools
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {PUBLIC_NAV.map((n, i) =>
              <motion.div
                key={n.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) => cx(
                    'px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 rounded-full',
                    isActive 
                      ? 'text-gold bg-gold/10 dark:bg-gold/20' 
                      : 'text-ink-muted dark:text-gray-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  )}
                >
                  {n.label}
                </NavLink>
              </motion.div>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-ink-muted dark:text-gray-400 hover:text-gold dark:hover:text-gold transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </motion.button>
            
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                Portal login
              </Button>
            </Link>
            
            <Link to="/apply">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="sm" 
                  className="glass-gold text-navy font-bold rounded-full px-6 btn-glow shadow-glow hover:shadow-glow-lg transition-shadow duration-300"
                >
                  APPLY NOW
                </Button>
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-ink-muted dark:text-gray-400"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </motion.button>
            
            <button 
              onClick={() => setOpen((o) => !o)} 
              aria-label="Toggle menu" 
              aria-expanded={open} 
              className="h-10 w-10 grid place-items-center rounded-lg border border-surface-border dark:border-white/20"
            >
              {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden overflow-hidden border-t border-surface-border dark:border-white/10 bg-white dark:bg-navy-900"
          >
            <nav className="px-4 py-4 space-y-1" aria-label="Mobile">
              {PUBLIC_NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => cx(
                      'block rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200',
                      isActive 
                        ? 'bg-gold/10 text-gold dark:bg-gold/20' 
                        : 'text-ink dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    )}
                  >
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="flex gap-3 pt-4">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="secondary" full size="sm">
                    Portal login
                  </Button>
                </Link>
                <Link to="/apply" className="flex-1" onClick={() => setOpen(false)}>
                  <Button full size="sm" className="glass-gold text-navy font-bold">
                    APPLY NOW
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SiteFooter() {
  const { darkMode } = useApp();
  const col = 'space-y-2 text-[13.5px] text-gray-400';
  const head = 'text-[12px] font-semibold uppercase tracking-[0.1em] text-gold mb-3';
  
  return (
    <footer className={cx(
      'relative overflow-hidden',
      darkMode ? 'bg-gradient-to-b from-navy-900 to-navy-dark' : 'bg-gradient-to-b from-navy-900 to-navy-dark'
    )}>
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <SalaMark tone="white" className="h-10 w-10 text-sm" />
              <span className="font-heading text-[16px] font-bold text-white">St. Ann Lifred Academy Schools</span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-gray-400 max-w-sm">
              A Nairobi private school for ECD through Grade 6, educating children to learn with curiosity, grow in character and lead with integrity.
            </p>
            <div className="mt-5 flex gap-2">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((I, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="h-9 w-9 grid place-items-center rounded-lg glass hover:bg-gold transition-colors duration-300"
                >
                  <I size={16} className="text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className={head}>Explore</p>
            <ul className={col}>
              {PUBLIC_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-gold transition-colors duration-200">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={head}>Admissions</p>
            <ul className={col}>
              <li><Link to="/apply" className="hover:text-gold transition-colors duration-200">Apply online</Link></li>
              <li><Link to="/track" className="hover:text-gold transition-colors duration-200">Track an application</Link></li>
              <li><Link to="/visit" className="hover:text-gold transition-colors duration-200">Book a school visit</Link></li>
              <li><Link to="/admissions" className="hover:text-gold transition-colors duration-200">Fees & requirements</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors duration-200">Parent portal</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors duration-200">Student & staff login</Link></li>
            </ul>
          </div>

          <div>
            <p className={head}>Contact</p>
            <ul className={col}>
              <li className="flex gap-2"><MapPinIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.address}</li>
              <li className="flex gap-2"><PhoneIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.phone}</li>
              <li className="flex gap-2"><MailIcon size={15} className="mt-0.5 shrink-0 text-gold" />{SCHOOL.email}</li>
              <li className="text-gray-400">{SCHOOL.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-gray-400">
          <p>© 2026 St. Ann Lifred Academy Schools. All rights reserved.</p>
          <p>Registered with the Ministry of Education · Nairobi County</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  const { toasts, dismiss } = useApp();
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-full w-full bg-white dark:bg-navy-dark flex flex-col transition-colors duration-300">
      <SiteHeader />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -8 }} 
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} 
          className="flex-1 pt-[80px]"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
