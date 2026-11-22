import React from 'react';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { MemoryExperience } from '../memories/MemoryExperience';

interface MemoryGalleryProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

/**
 * Chapter 5: OUR MEMORIES – A UNIVERSE OF MOMENTS
 * 3D Interactive Memory Photo Sphere inspired by Mist Orb (Three.js WebGL)
 */
export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const memories = cfg.memories;
  const { playClick } = useAudio();

  return (
    <MemoryExperience
      memories={memories}
      onProceed={onProceed}
      playClick={playClick}
    />
  );
};
