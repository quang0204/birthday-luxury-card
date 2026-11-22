import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GiftBox3D } from '../3d/GiftBox3D';
import { BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface GiftOpeningProps {
  onProceed: () => void;
}

export const GiftOpening: React.FC<GiftOpeningProps> = ({ onProceed }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { playGiftPop, playClick } = useAudio();

  const handleOpenGift = () => {
    if (isOpened) return;
    setIsOpened(true);
    playGiftPop();
    triggerBirthdayConfetti();

    setTimeout(() => {
      onProceed();
    }, 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
      {/* Question Prompt */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-soft text-xs font-medium border border-rose-400/20 mb-3"
      >
        <Sparkles size={14} className="text-champagne" />
        <span>Chương II • Mở Hộp Quà Ma Thuật</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-warm-white text-glow-pink max-w-sm"
      >
        {BIRTHDAY_CONFIG.giftOpening.promptText}
      </motion.h2>

      {/* 3D Gift Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full my-4"
      >
        <GiftBox3D
          isOpened={isOpened}
          onOpen={handleOpenGift}
          recipientName={BIRTHDAY_CONFIG.recipientName}
        />
      </motion.div>

      {/* Interactive Ready Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full px-6 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleOpenGift}
          disabled={isOpened}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-400 via-rose-500 to-lavender text-white shadow-glow-gold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:pointer-events-none"
        >
          {isOpened ? (
            <>
              <CheckCircle2 size={18} className="text-white animate-bounce" />
              <span>ĐANG MỞ RA ĐIỀU DIỆU KỲ...</span>
            </>
          ) : (
            <>
              <span>{BIRTHDAY_CONFIG.giftOpening.buttonText}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="text-xs text-lavender-muted/70 mt-1">
          Hộp quà đang tích tụ ánh sáng phép thuật ✨
        </p>
      </motion.div>
    </div>
  );
};
