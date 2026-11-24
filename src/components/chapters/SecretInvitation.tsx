import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Envelope3D } from '../3d/Envelope3D';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface SecretInvitationProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const SecretInvitation: React.FC<SecretInvitationProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [isOpened, setIsOpened] = useState(false);
  const { playEnvelopeOpen, startMusic } = useAudio();

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    playEnvelopeOpen();
    startMusic();
    triggerBirthdayConfetti();

    setTimeout(() => {
      onProceed();
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full px-4">
{/* Main Editorial Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.2] text-[#FAF4F0] max-w-md tracking-tight"
      >
        {cfg.invitation.teaser}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-3 max-w-xs sm:max-w-sm font-sans font-light leading-relaxed tracking-wide"
      >
        {cfg.invitation.subTeaser}
      </motion.p>

      {/* 3D Wax Seal Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="w-full my-4"
      >
        <Envelope3D isOpened={isOpened} onOpen={handleOpen} />
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mt-2 w-full px-6 flex flex-col items-center gap-3"
      >
        <button
          onClick={handleOpen}
          disabled={isOpened}
          className="btn-editorial-primary px-8 py-3.5 tracking-[0.12em] text-xs uppercase group disabled:opacity-75 disabled:pointer-events-none"
        >
          <span>{isOpened ? 'Đang Mở Món Quà...' : cfg.invitation.buttonText}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform ml-1" />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#FAF4F0]/80 font-serif italic tracking-wider">
          <span>Chạm vào bức thư hoặc nút bấm để bước vào hành trình</span>
          <span className="text-rose-300 font-sans font-medium text-[11px] not-italic px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">♫ Bật âm thanh</span>
        </div>
      </motion.div>
    </div>
  );
};
