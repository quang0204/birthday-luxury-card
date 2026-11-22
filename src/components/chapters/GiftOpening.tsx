import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GiftBox3D } from '../3d/GiftBox3D';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface GiftOpeningProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const GiftOpening: React.FC<GiftOpeningProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [isOpened, setIsOpened] = useState(false);
  const { playGiftPop } = useAudio();

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
      {/* Superr Sticker Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 1.5 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-3"
      >
        <Sparkles size={14} className="text-[#FBBF24]" />
        <span>Chương II • Mở Hộp Quà Ma Thuật</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white text-glow-marker max-w-sm"
      >
        {cfg.giftOpening.promptText}
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
          recipientName={cfg.recipientName}
        />
      </motion.div>

      {/* Tactile Ready Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full px-6 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleOpenGift}
          disabled={isOpened}
          className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2 group disabled:opacity-85 disabled:pointer-events-none"
        >
          {isOpened ? (
            <>
              <CheckCircle2 size={20} className="text-white animate-bounce" />
              <span>ĐANG MỞ RA ĐIỀU DIỆU KỲ...</span>
            </>
          ) : (
            <>
              <span>{cfg.giftOpening.buttonText}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </>
          )}
        </button>

        <p className="text-xs text-[#F7EFE9]/60 mt-1 font-sans">
          Hộp quà đang tích tụ ánh sáng phép thuật ✨
        </p>
      </motion.div>
    </div>
  );
};
