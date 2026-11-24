import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full px-4">
{/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-snug text-[#FAF4F0] max-w-md tracking-tight"
      >
        {cfg.giftOpening.promptText}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-xs sm:text-sm text-[#FAF4F0]/60 mt-2 font-sans font-light tracking-wide"
      >
        Một món quà kỹ thuật số được thiết kế riêng cho ngày đặc biệt
      </motion.p>

      {/* 3D Gift Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full my-4"
      >
        <GiftBox3D
          isOpened={isOpened}
          onOpen={handleOpenGift}
          recipientName={cfg.recipientName}
        />
      </motion.div>
    </div>
  );
};
