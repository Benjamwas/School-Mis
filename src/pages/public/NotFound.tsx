import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/primitives';

export function NotFound() {
  return (
    <div className="w-full min-h-screen">
      <div className="absolute inset-0 gradient-section-light dark:gradient-section-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center">
        <motion.p 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-heading text-[80px] leading-none text-gradient font-black"
        >
          404
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-heading text-[32px] font-bold heading-color"
        >
          We Couldn't Find That Page
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-[15px] text-ink-muted dark:text-gray-400"
        >
          The link may be out of date, or the page may have moved. Try the homepage, or search from the portal if you were signed in.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link to="/">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="rounded-full">Back To Homepage</Button>
            </motion.div>
          </Link>
          <Link to="/contact">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" className="rounded-full">Contact The School</Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
