import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
      {/* Superr Laminated Sticker Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-4 select-none"
      >
        <Sparkles size={14} className="animate-spin-slow" />
        <span>{cfg.invitation.badgeText}</span>
      </motion.div>

      {/* Main Teaser Titles */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white text-glow-marker"
      >
        {cfg.invitation.teaser}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-sm sm:text-base text-[#F7EFE9]/85 mt-2 font-sans max-w-xs sm:max-w-sm"
      >
        {cfg.invitation.subTeaser}
      </motion.p>

      {/* 3D Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full my-2"
      >
        <Envelope3D isOpened={isOpened} onOpen={handleOpen} />
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mt-4 w-full px-6 flex flex-col items-center gap-3"
      >
        <button
          onClick={handleOpen}
          disabled={isOpened}
          className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2 group disabled:opacity-75 disabled:pointer-events-none"
        >
          <span>{isOpened ? 'ĐANG MỞ MÓN QUÀ...' : cfg.invitation.buttonText}</span>
          <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
        </button>

        <span className="text-xs text-[#F7EFE9]/50 tracking-wide font-sans">
          Chạm vào phong bì hoặc nút để bắt đầu ✨
        </span>
      </motion.div>
    </div>
  );
};
