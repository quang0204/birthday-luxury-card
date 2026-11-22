import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Heart } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Background celebration fireworks */}
      <Fireworks active={true} burstCount={4} continuous={true} />

      {/* Floating balloons background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{ y: [-20, -120], x: [0, 20, -15, 0], opacity: [0.7, 0.95, 0.7] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute -left-4 top-20 text-4xl filter drop-shadow"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [-10, -140], x: [0, -25, 15, 0], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 11, delay: 1, ease: 'easeInOut' }}
          className="absolute -right-4 top-10 text-5xl filter drop-shadow"
        >
          🎈
        </motion.div>
      </div>

      {/* Superr Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-3"
      >
        <Sparkles size={14} className="animate-spin-slow" />
        <span>Chương III • Đại Tiệc Sinh Nhật</span>
        <Sparkles size={14} className="animate-spin-slow" />
      </motion.div>

      {/* Main Festive Title (Nunito ExtraBold / Black) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-1"
      >
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white text-glow-marker">
          {cfg.celebration.headline}
        </h1>

        <div className="inline-flex items-center justify-center gap-2 mt-2 px-4 py-1 rounded-2xl bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm transform -rotate-1">
          <Heart size={22} className="fill-[#2B1A07] text-[#2B1A07] animate-pulse" />
          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wide">
            {cfg.recipientName}
          </h2>
          <Heart size={22} className="fill-[#2B1A07] text-[#2B1A07] animate-pulse" />
        </div>
      </motion.div>

      {/* Subtitle & Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-3 px-4"
      >
        <p className="text-sm sm:text-base font-bold text-[#FDFBF9]">
          {cfg.celebration.subheadline}
        </p>
        <p className="text-xs sm:text-sm text-[#F7EFE9]/75 max-w-sm mx-auto mt-1 italic font-sans">
          "{cfg.celebration.quote}"
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
          className="superr-btn-primary w-full sm:w-auto px-10 py-4 text-base gap-2.5 group"
        >
          <Flame size={20} className="text-[#FBBF24] animate-pulse" />
          <span>{cfg.celebration.buttonText}</span>
          <Sparkles size={18} />
        </button>

        <span className="text-xs text-[#F7EFE9]/50 font-sans">
          Chạm vào bánh hoặc nhấn nút để bước vào phòng ước nguyện
        </span>
      </motion.div>
    </div>
  );
};
