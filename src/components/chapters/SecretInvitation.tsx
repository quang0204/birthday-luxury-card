import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Envelope3D } from '../3d/Envelope3D';
import { BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface SecretInvitationProps {
  onProceed: () => void;
}

export const SecretInvitation: React.FC<SecretInvitationProps> = ({ onProceed }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { playEnvelopeOpen, startMusic } = useAudio();

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    playEnvelopeOpen();
    startMusic(); // Starts background music on first user interaction!
    triggerBirthdayConfetti();

    setTimeout(() => {
      onProceed();
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle text-xs font-medium text-rose-soft mb-4 border border-rose-400/20"
      >
        <Sparkles size={14} className="text-champagne animate-pulse" />
        <span>{BIRTHDAY_CONFIG.invitation.badgeText}</span>
      </motion.div>

      {/* Main Teaser Titles */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-rose-soft to-lavender-light text-glow-pink"
      >
        {BIRTHDAY_CONFIG.invitation.teaser}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-sm sm:text-base text-lavender-muted mt-2 font-sans max-w-xs sm:max-w-sm"
      >
        {BIRTHDAY_CONFIG.invitation.subTeaser}
      </motion.p>

      {/* 3D Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
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
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-rose-glow via-rose-600 to-lavender text-white shadow-glow-pink hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          <span>{isOpened ? 'ĐANG MỞ MÓN QUÀ...' : BIRTHDAY_CONFIG.invitation.buttonText}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <span className="text-xs text-white/40 tracking-wider">
          Chạm vào phong bì hoặc nút để bắt đầu
        </span>
      </motion.div>
    </div>
  );
};
