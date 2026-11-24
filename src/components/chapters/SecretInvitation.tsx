import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    </div>
  );
};
