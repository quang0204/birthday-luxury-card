import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';

interface GiftBox3DProps {
  isOpened: boolean;
  onOpen: () => void;
  recipientName: string;
}

export const GiftBox3D: React.FC<GiftBox3DProps> = ({ isOpened, onOpen, recipientName }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer select-none py-12"
      onClick={!isOpened ? onOpen : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1100px' }}
    >
      {/* Dynamic ambient backglow */}
      <div 
        className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          isOpened 
            ? 'bg-champagne/35 scale-135' 
            : isHovered 
              ? 'bg-rose-accent/30 scale-110' 
              : 'bg-lavender-dark/25 scale-90'
        }`} 
      />

      {/* Main Container */}
      <motion.div
        animate={
          isOpened
            ? { scale: 1.05, y: 15 }
            : isHovered
            ? { scale: 1.04, y: -10, rotateY: 5 }
            : { scale: 1, y: 0, rotateY: 0 }
        }
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Floating Greeting Card Rising from Box */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.7 }}
          animate={
            isOpened
              ? { y: -130, opacity: 1, scale: 1, rotateZ: -2 }
              : { y: 50, opacity: 0, scale: 0.7 }
          }
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', damping: 15 }}
          className="absolute z-40 w-64 sm:w-72 p-5 rounded-2xl border border-[#2D1117]/15 shadow-2xl text-center bg-[#FCFAF7] text-[#2D1117]"
        >
          <div className="flex items-center justify-center gap-1.5 text-[#D4627A] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Món Quà Vô Giá</span>
            <Sparkles size={14} className="animate-spin-slow" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1117]">
            Happy Birthday, {recipientName}!
          </h3>
          <p className="text-xs text-[#2D1117]/70 mt-1 font-sans">
            Ngày sinh nhật đặc biệt nhất năm nay ✨
          </p>
        </motion.div>

        {/* Gift Box Base */}
        <div className="absolute bottom-6 w-48 h-44 sm:w-56 sm:h-48 rounded-2xl bg-gradient-to-b from-[#E11D48] via-[#BE123C] to-[#881337] shadow-2xl border border-rose-400/30 overflow-hidden z-20">
          {/* Subtle glossy sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

          {/* Golden Vertical Ribbon */}
          <div className="absolute inset-x-0 mx-auto w-10 sm:w-12 h-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-md flex items-center justify-center">
            <div className="w-1 h-full bg-amber-500/30 mx-auto" />
          </div>

          {/* Golden Horizontal Ribbon */}
          <div className="absolute inset-y-0 my-auto h-10 sm:h-12 w-full bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 shadow-md">
            <div className="h-1 w-full bg-amber-500/30 my-auto" />
          </div>

          {/* Inner Light Glow when opened */}
          {isOpened && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-champagne/80 via-rose-soft/40 to-white blur-md"
            />
          )}
        </div>

        {/* Gift Box Lid & Bow (Pops off when opened) */}
        <motion.div
          animate={
            isOpened
              ? { y: -160, rotateZ: 25, rotateX: -30, opacity: 0.8 }
              : isHovered
              ? { y: -6 }
              : { y: 0 }
          }
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute top-8 sm:top-6 w-52 h-14 sm:w-60 sm:h-16 rounded-xl bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#9F1239] shadow-2xl border-2 border-rose-300/40 z-30 flex items-center justify-center"
        >
          {/* Lid Vertical Ribbon */}
          <div className="w-10 sm:w-12 h-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-sm" />

          {/* 3D Ribbon Bow on top */}
          <div className="absolute -top-7 sm:-top-8 flex items-center justify-center">
            {/* Left Bow Loop */}
            <div className="w-9 h-11 rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg -rotate-45 transform origin-bottom-right" />
            {/* Right Bow Loop */}
            <div className="w-9 h-11 rounded-full border-4 border-amber-300 bg-gradient-to-bl from-amber-200 to-amber-400 shadow-lg rotate-45 transform origin-bottom-left" />
            {/* Center Bow Knot */}
            <div className="absolute w-6 h-6 rounded-full bg-amber-200 border-2 border-amber-400 shadow-md" />
          </div>
        </motion.div>

        {/* Tap hint when not opened */}
        {!isOpened && (
          <motion.div
            animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-8 z-30 flex items-center gap-1.5 text-xs text-rose-soft font-medium tracking-wide bg-midnight-900/80 px-3 py-1 rounded-full border border-rose-400/30 shadow-md"
          >
            <Gift size={13} className="text-rose-accent" />
            <span>Chạm để mở hộp</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
