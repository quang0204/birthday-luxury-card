import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="w-full px-6 flex flex-col items-center gap-2 mt-2"
      >
        <button
          onClick={handleOpenGift}
          disabled={isOpened}
          className="btn-editorial-primary px-8 py-3.5 tracking-[0.12em] text-xs uppercase group disabled:opacity-85 disabled:pointer-events-none"
        >
          {isOpened ? (
            <>
              <CheckCircle2 size={16} className="text-[#FEEBEF] animate-pulse mr-1" />
              <span>Đang Mở Ra Điều Diệu Kỳ...</span>
            </>
          ) : (
            <>
              <span>{cfg.giftOpening.buttonText}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform ml-1" />
            </>
          )}
        </button>

        <p className="text-[11px] text-[#FAF4F0]/40 font-serif italic tracking-wider mt-1">
          Chạm vào chiếc nơ để tự tay mở hộp quà
        </p>
      </motion.div>
    </div>
  );
};
