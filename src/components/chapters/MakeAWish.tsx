import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Wind, ArrowRight, Sparkles } from 'lucide-react';
import { BirthdayCake3D } from '../3d/BirthdayCake3D';
import { Fireworks } from '../common/Fireworks';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti, triggerContinuousConfetti } from '../../utils/animation';

interface MakeAWishProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const MakeAWish: React.FC<MakeAWishProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0); // 0 to 100
  const [micActive, setMicActive] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const holdIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const { playBlowCandle, playFanfare, playFirework } = useAudio();

  // Handle extinguishing candles
  const handleExtinguish = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setIsBlowing(false);
    playBlowCandle();

    setTimeout(() => {
      playFirework();
      playFanfare();
      triggerBirthdayConfetti();
      triggerContinuousConfetti(3500);
    }, 400);

    // Stop mic stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  // Method 1: Hold to blow button handlers
  const startHolding = () => {
    if (!candlesLit) return;
    setIsBlowing(true);
    let current = blowProgress;
    holdIntervalRef.current = window.setInterval(() => {
      current += 6;
      setBlowProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(holdIntervalRef.current!);
        handleExtinguish();
      }
    }, 50);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (candlesLit) {
      setIsBlowing(false);
      setBlowProgress(0);
    }
  };

  // Method 2: Microphone detection
  const toggleMicrophone = async () => {
    if (!micSupported) return;

    if (micActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      setMicActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      setMicActive(true);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      let blowAccumulator = 0;

      const checkBlow = () => {
        if (!candlesLit || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);

        let sum = 0;
        for (let i = 2; i < 24; i++) {
          sum += buffer[i];
        }
        const avg = sum / 22;

        if (avg > 55) {
          setIsBlowing(true);
          blowAccumulator += 8;
          setBlowProgress(Math.min(blowAccumulator, 100));
          if (blowAccumulator >= 100) {
            handleExtinguish();
            return;
          }
        } else {
          blowAccumulator = Math.max(0, blowAccumulator - 2);
          setBlowProgress(blowAccumulator);
          if (blowAccumulator === 0) {
            setIsBlowing(false);
          }
        }

        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.warn('Microphone permission denied or not supported:', err);
      setMicSupported(false);
      setMicActive(false);
    }
  };

  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setMicSupported(false);
    }
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative px-4">
      {/* Soft celebration fireworks when extinguished */}
      {!candlesLit && <Fireworks active={true} burstCount={4} continuous={true} />}

      {/* Editorial Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-badge mb-4"
      >
        <span>Chapter IV • The Wish</span>
      </motion.div>

      {/* Instructions / Wish Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="px-4 mb-2 max-w-md"
      >
        <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug text-[#FAF4F0] tracking-tight">
          {candlesLit
            ? cfg.makeAWish.title
            : cfg.makeAWish.blownTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-2 font-sans font-light leading-relaxed">
          {candlesLit
            ? cfg.makeAWish.instructionHold
            : cfg.makeAWish.blownSubtitle}
        </p>
      </motion.div>

      {/* 3D Birthday Cake */}
      <div className="w-full relative my-2">
        <BirthdayCake3D
          candlesLit={candlesLit}
          isBlowing={isBlowing}
          onCakeClick={() => {
            if (candlesLit) {
              handleExtinguish();
            }
          }}
        />

        {/* Ethereal glowing halo ring when candles are blown */}
        {!candlesLit && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1.1], opacity: [0.6, 0.25, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-72 h-72 rounded-full border border-[#E6C29C]/40 pointer-events-none"
          />
        )}
      </div>

      {/* Interaction Controls */}
      {candlesLit ? (
        <div className="w-full px-6 flex flex-col items-center gap-3 mt-3">
          {/* Refined Hold-to-blow Button with smooth progress */}
          <div className="relative w-full sm:w-80">
            <button
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              className="relative overflow-hidden w-full px-8 py-3.5 rounded-full font-sans font-bold text-xs tracking-[0.14em] uppercase bg-[#D4627A] text-white border border-[#FAF4F0]/25 shadow-lg select-none cursor-pointer flex items-center justify-center gap-2 group transition-all"
            >
              {/* Progress layer */}
              <div
                className="absolute inset-0 bg-[#E6C29C] transition-all duration-75 pointer-events-none opacity-90"
                style={{ width: `${blowProgress}%` }}
              />

              <Wind size={16} className="relative z-10 text-white" />
              <span className="relative z-10 text-white">
                {blowProgress > 0 ? `Đang Thổi... ${blowProgress}%` : 'Nhấn Giữ Để Thổi Nến'}
              </span>
            </button>
          </div>

          {/* Optional Mic Toggle */}
          {micSupported && (
            <button
              onClick={toggleMicrophone}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-sans font-medium transition-all border backdrop-blur-md cursor-pointer ${
                micActive
                  ? 'bg-[#D4627A]/30 text-[#FEEBEF] border-[#D4627A] animate-pulse'
                  : 'bg-[#FAF4F0]/5 text-[#FAF4F0]/70 border-[#FAF4F0]/15 hover:bg-[#FAF4F0]/10 hover:text-[#FAF4F0]'
              }`}
            >
              {micActive ? <Mic size={13} className="text-[#E77C92]" /> : <MicOff size={13} />}
              <span>{micActive ? 'Micro đang lắng nghe tiếng thổi...' : 'Bật Micro để thổi nến'}</span>
            </button>
          )}

          <p className="text-[11px] text-[#FAF4F0]/40 font-serif italic tracking-wider">
            {cfg.makeAWish.micFallbackHint}
          </p>
        </div>
      ) : (
        /* Continue Button after blowing */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-6 flex flex-col items-center gap-3 mt-3"
        >
          <div className="flex items-center gap-2 text-[#E77C92] text-xs font-serif italic tracking-wider mb-1">
            <Sparkles size={14} className="text-[#E6C29C]" />
            <span>Ước nguyện đã được thắp sáng trên những vì sao</span>
            <Sparkles size={14} className="text-[#E6C29C]" />
          </div>

          <button
            onClick={onProceed}
            className="btn-editorial-primary px-9 py-4 tracking-[0.14em] text-xs uppercase gap-2"
          >
            <span>{cfg.makeAWish.continueButton}</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
