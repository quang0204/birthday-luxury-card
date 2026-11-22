import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Wind, Sparkles, ArrowRight, Heart } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Fireworks burst when candles extinguished */}
      {!candlesLit && <Fireworks active={true} burstCount={5} continuous={true} />}

      {/* Superr Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22C55E] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2"
      >
        <Sparkles size={14} className="text-[#FBBF24]" />
        <span>Chương IV • Ước Nguyện Tuổi Mới</span>
      </motion.div>

      {/* Wish Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mb-2 max-w-md"
      >
        <h2 className="font-display text-xl sm:text-2xl font-black text-white">
          {candlesLit
            ? cfg.makeAWish.title
            : cfg.makeAWish.blownTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#F7EFE9]/80 mt-1 font-sans">
          {candlesLit
            ? cfg.makeAWish.instructionHold
            : cfg.makeAWish.blownSubtitle}
        </p>
      </motion.div>

      {/* 3D Cake */}
      <div className="w-full relative my-1">
        <BirthdayCake3D
          candlesLit={candlesLit}
          isBlowing={isBlowing}
          onCakeClick={() => {
            if (candlesLit) {
              handleExtinguish();
            }
          }}
        />

        {/* Ethereal glowing ring when blown */}
        {!candlesLit && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.4, opacity: [0.8, 0.4, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-64 h-64 rounded-full border-2 border-[#FBBF24] shadow-glow-sunshine pointer-events-none"
          />
        )}
      </div>

      {/* Controls & Interaction */}
      {candlesLit ? (
        <div className="w-full px-6 flex flex-col items-center gap-3 mt-4">
          {/* Hold Button with visual progress fill and tactile Superr shadow */}
          <div className="relative w-full sm:w-auto">
            <button
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              className="relative overflow-hidden w-full sm:w-80 px-8 py-4 rounded-full font-display font-black text-base tracking-wide bg-[#FF6F1E] text-white border-2.5 border-[#2B1A07] shadow-sticker hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-sticker-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#2B1A07] select-none cursor-pointer flex items-center justify-center gap-2"
            >
              {/* Progress fill layer */}
              <div
                className="absolute inset-0 bg-[#FBBF24] opacity-90 transition-all duration-75 pointer-events-none"
                style={{ width: `${blowProgress}%` }}
              />

              <Wind size={22} className="relative z-10 animate-pulse text-[#2B1A07]" />
              <span className="relative z-10 text-[#2B1A07]">
                {blowProgress > 0 ? `ĐANG THỔI... ${blowProgress}%` : 'NHẤN GIỮ ĐỂ THỔI NẾN'}
              </span>
            </button>
          </div>

          {/* Optional Microphone Toggle */}
          {micSupported && (
            <button
              onClick={toggleMicrophone}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-extrabold transition-all border-2 border-[#2B1A07] cursor-pointer ${
                micActive
                  ? 'bg-[#FF66CF] text-[#2B1A07] shadow-sticker-sm animate-pulse'
                  : 'bg-[#FDFBF9] text-[#2B1A07] shadow-sticker-sm hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
            >
              {micActive ? <Mic size={15} /> : <MicOff size={15} />}
              <span>{micActive ? 'Micro đang lắng nghe tiếng thổi...' : 'Bật Micro để thổi nến'}</span>
            </button>
          )}

          <p className="text-xs text-[#F7EFE9]/50 italic font-sans">
            {cfg.makeAWish.micFallbackHint}
          </p>
        </div>
      ) : (
        /* Continue Button after blowing */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-6 flex flex-col items-center gap-3 mt-4"
        >
          <div className="flex items-center gap-2 text-[#FBBF24] text-xs font-display font-black tracking-wider uppercase mb-1">
            <Heart size={16} className="text-[#FF66CF] fill-[#FF66CF]" />
            <span>Ước Nguyện Đã Bay Vào Vũ Trụ</span>
            <Heart size={16} className="text-[#FF66CF] fill-[#FF66CF]" />
          </div>

          <button
            onClick={onProceed}
            className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2.5"
          >
            <span>{cfg.makeAWish.continueButton}</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
