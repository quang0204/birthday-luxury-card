import { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/audio';
import { BIRTHDAY_CONFIG } from '../config/birthday.config';

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('birthday_muted');
      return saved === 'true';
    }
    return false;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.initBackgroundMusic(
      BIRTHDAY_CONFIG.audio.backgroundMusicUrl,
      BIRTHDAY_CONFIG.audio.defaultVolume
    );
    if (isMuted) {
      soundEngine.toggleMute();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    localStorage.setItem('birthday_muted', String(nextMuted));
    setIsPlaying(!nextMuted);
  }, []);

  const startMusic = useCallback(() => {
    if (!isMuted) {
      soundEngine.playBackgroundMusic();
      setIsPlaying(true);
    }
  }, [isMuted]);

  const pauseMusic = useCallback(() => {
    soundEngine.pauseBackgroundMusic();
    setIsPlaying(false);
  }, []);

  return {
    isMuted,
    isPlaying,
    toggleMute,
    startMusic,
    pauseMusic,
    playEnvelopeOpen: () => soundEngine.playEnvelopeOpen(),
    playGiftPop: () => soundEngine.playGiftPop(),
    playBlowCandle: () => soundEngine.playBlowCandle(),
    playFirework: () => soundEngine.playFirework(),
    playClick: () => soundEngine.playClick(),
    playFanfare: () => soundEngine.playFanfare(),
  };
};
