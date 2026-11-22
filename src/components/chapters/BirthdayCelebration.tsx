import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Heart } from 'lucide-react';
import { BirthdayCake3D } from '../3d/BirthdayCake3D';
import { Fireworks } from '../common/Fireworks';
import { BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';

interface BirthdayCelebrationProps {
  onProceed: () => void;
}

export const BirthdayCelebration: React.FC<BirthdayCelebrationProps> = ({ onProceed }) => {
  const { playClick } = useAudio();

  const handleMakeWish = () => {
    playClick();
    onProceed();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Background celebration fireworks */}
      <Fireworks active={true} burstCount={4} continuous={true} />

      {/* Floating balloons background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{ y: [-20, -120], x: [0, 20, -15, 0], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute -left-4 top-20 text-3xl opacity-60"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [-10, -140], x: [0, -25, 15, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 11, delay: 1, ease: 'easeInOut' }}
          className="absolute -right-4 top-10 text-4xl opacity-50"
        >
          🎈
        </motion.div>
      </div>

      {/* Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-soft text-xs font-semibold tracking-wider uppercase border border-rose-400/30 mb-3 shadow-glow-pink/20"
      >
        <Sparkles size={14} className="text-champagne animate-spin-slow" />
        <span>Chương III • Đại Tiệc Sinh Nhật</span>
        <Sparkles size={14} className="text-champagne animate-spin-slow" />
      </motion.div>

      {/* Animated Staggered Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-1"
      >
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-glow via-warm-white to-champagne text-glow-pink">
          {BIRTHDAY_CONFIG.celebration.headline}
        </h1>

        <div className="inline-flex items-center justify-center gap-2 mt-1">
          <Heart size={20} className="text-rose-accent fill-rose-accent animate-pulse" />
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-lavender-light text-glow-gold">
            {BIRTHDAY_CONFIG.recipientName}
          </h2>
          <Heart size={20} className="text-rose-accent fill-rose-accent animate-pulse" />
        </div>
      </motion.div>

      {/* Subtitle & Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-3 px-4"
      >
        <p className="text-sm sm:text-base font-semibold text-rose-soft">
          {BIRTHDAY_CONFIG.celebration.subheadline}
        </p>
        <p className="text-xs sm:text-sm text-lavender-muted max-w-sm mx-auto mt-1 italic">
          "{BIRTHDAY_CONFIG.celebration.quote}"
        </p>
      </motion.div>

      {/* 3D Birthday Cake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, type: 'spring' }}
        className="w-full my-2"
      >
        <BirthdayCake3D candlesLit={true} onCakeClick={handleMakeWish} />
      </motion.div>

      {/* Call to action button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full px-6 flex flex-col items-center gap-2 mt-2"
      >
        <button
          onClick={handleMakeWish}
          className="w-full sm:w-auto px-9 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-glow-gold hover:shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Flame size={19} className="text-amber-200 animate-pulse" />
          <span>{BIRTHDAY_CONFIG.celebration.buttonText}</span>
          <Sparkles size={16} />
        </button>

        <span className="text-xs text-lavender-muted/70">
          Chạm vào bánh hoặc nhấn nút để bước vào phòng ước nguyện
        </span>
      </motion.div>
    </div>
  );
};
