import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { BirthdayCake3D } from '../3d/BirthdayCake3D';
import { Fireworks } from '../common/Fireworks';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';

interface BirthdayCelebrationProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const BirthdayCelebration: React.FC<BirthdayCelebrationProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const { playClick } = useAudio();

  const handleMakeWish = () => {
    playClick();
    onProceed();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full relative px-4">
      {/* Background fireworks - soft and ambient */}
      <Fireworks active={true} burstCount={3} continuous={true} />

      {/* Editorial Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-badge mb-4"
      >
        <span>Chapter III • The Celebration</span>
      </motion.div>

      {/* Grand Typographic Centerpiece */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="space-y-2 mb-2"
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#E77C92] font-semibold block">
          {cfg.celebration.subheadline}
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#FAF4F0] leading-none">
          {cfg.celebration.headline}
        </h1>

        <div className="pt-1 pb-2 relative inline-block">
          <motion.span
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#E77C92] font-normal block leading-tight text-glow-editorial"
          >
            {cfg.recipientName}
          </motion.span>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4627A] to-transparent mx-auto mt-2" />
        </div>
      </motion.div>

      {/* Editorial Poetic Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="max-w-md mx-auto px-4 my-2"
      >
        <p className="text-xs sm:text-sm text-[#FAF4F0]/70 italic font-serif leading-relaxed tracking-wide">
          "{cfg.celebration.quote}"
        </p>
      </motion.div>

      {/* 3D Birthday Cake Centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="w-full my-3"
      >
        <BirthdayCake3D candlesLit={true} onCakeClick={handleMakeWish} />
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full px-6 flex flex-col items-center gap-2 mt-2"
      >
        <button
          onClick={handleMakeWish}
          className="btn-editorial-primary px-9 py-4 tracking-[0.14em] text-xs uppercase gap-2 group"
        >
          <Flame size={16} className="text-[#FEEBEF] group-hover:scale-110 transition-transform" />
          <span>{cfg.celebration.buttonText}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform ml-1" />
        </button>

        <span className="text-[11px] text-[#FAF4F0]/40 font-serif italic tracking-wider">
          Chạm vào chiếc bánh hoặc nhấn nút để bước sang khoảnh khắc ước nguyện
        </span>
      </motion.div>
    </div>
  );
};
