import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface Envelope3DProps {
  isOpened: boolean;
  onOpen: () => void;
}

export const Envelope3D: React.FC<Envelope3DProps> = ({ isOpened, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer select-none py-10 outline-none focus-visible:ring-2 focus-visible:ring-[#D4627A] rounded-2xl"
      role="button"
      tabIndex={0}
      aria-label="Mở phong thư chúc mừng sinh nhật"
      onClick={!isOpened ? onOpen : undefined}
      onKeyDown={(e) => {
        if (!isOpened && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpen();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Ambient glow behind envelope (gradient optimized) */}
      <div 
        className={`absolute w-72 h-48 rounded-full pointer-events-none transition-opacity duration-700 ${
          isOpened ? 'opacity-80 scale-125' : isHovered ? 'opacity-50 scale-110' : 'opacity-25'
        }`}
        style={{
          background: 'radial-gradient(ellipse, rgba(212, 98, 122, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* Main 3D Envelope container */}
      <motion.div
        animate={
          isOpened
            ? { scale: 1.05, y: 10, rotateX: 5 }
            : isHovered
            ? { scale: 1.03, y: -8, rotateX: 6, rotateY: -3 }
            : { scale: 1, y: [0, -6, 0], rotateX: [0, 2, 0], rotateY: [0, -1, 0] }
        }
        transition={
          isOpened || isHovered
            ? { type: 'spring', stiffness: 260, damping: 20 }
            : { repeat: Infinity, duration: 4.8, ease: 'easeInOut' }
        }
        className="relative w-72 h-48 sm:w-80 sm:h-52 rounded-xl shadow-2xl transition-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Envelope Backplate & Pocket */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2B0F19] to-[#14060C] border border-white/20 shadow-glass overflow-hidden">
          {/* Subtle paper grain texture overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* Inner golden card peeking when opened */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isOpened ? { y: -50, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="absolute left-6 right-6 top-4 h-36 bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] rounded-lg shadow-lg p-3 text-center border border-amber-200/60 z-10 flex flex-col items-center justify-center"
          >
            <Sparkles className="text-amber-500 mb-1 animate-pulse" size={18} />
            <p className="text-xs font-semibold text-[#2D1117] tracking-wider uppercase font-sans">Special Invitation</p>
            <p className="text-sm font-display text-rose-600 font-bold mt-1">Dành Cho Người Đặc Biệt</p>
          </motion.div>

          {/* Left and Right folded flaps */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
              background: 'linear-gradient(135deg, #2D111C 0%, #17070F 100%)',
              borderRight: '1px solid rgba(255,255,255,0.06)'
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
              background: 'linear-gradient(225deg, #270D18 0%, #15060D 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.06)'
            }}
          />

          {/* Bottom flap */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 100%, 50% 45%, 100% 100%)',
              background: 'linear-gradient(180deg, #240C16 0%, #12040B 100%)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          />
        </div>

        {/* Top Triangular Flap (Opens up) */}
        <motion.div
          animate={isOpened ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-x-0 top-0 h-28 origin-top"
          style={{
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
            background: 'linear-gradient(180deg, #3D1422 0%, #260A14 100%)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            borderBottom: '1px solid rgba(255,255,255,0.15)'
          }}
        />

        {/* Wax Seal with Heart Emblem */}
        {!isOpened && (
          <motion.div
            whileHover={{ scale: 1.15, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-rose-glow via-rose-600 to-[#9B1138] shadow-lg border-2 border-rose-300/40 flex items-center justify-center cursor-pointer group"
          >
            <div className="absolute inset-1 rounded-full border border-rose-300/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-warm-white fill-rose-100 drop-shadow-md group-hover:scale-110 transition-transform" />
            </div>
            {/* Wax seal edge ridges */}
            <div className="absolute -inset-1 rounded-full border border-rose-500/20 pointer-events-none animate-ping opacity-30" />
          </motion.div>
        )}

        {/* Ethereal light beam when opened */}
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.9, scaleY: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 bottom-1/2 -translate-x-1/2 w-48 h-96 bg-gradient-to-t from-rose-accent/40 via-amber-300/20 to-transparent blur-xl pointer-events-none z-30"
          />
        )}
      </motion.div>
    </div>
  );
};
