import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

export function PageHero({ eyebrow, title, intro, image }: {eyebrow: string;title: string;intro: string;image?: string;}) {
  const { darkMode } = useApp();
  
  return (
    <section className="relative overflow-hidden min-h-[400px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gold mb-4 uppercase tracking-wider"
          >
            <span className="w-8 h-[2px] bg-gold" />
            {eyebrow}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-[38px] sm:text-[56px] lg:text-[64px] font-black leading-[1.05] text-white"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-gray-300"
          >
            {intro}
          </motion.p>
        </div>
        
        {image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <img 
              src={image} 
              alt="" 
              className="w-full aspect-[16/10] object-cover rounded-2xl shadow-card" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass-gold rounded-xl px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-navy shadow-glow"
            >
              Your Next Chapter Starts Here
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
