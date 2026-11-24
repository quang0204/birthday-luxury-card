import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, ArrowRight, Sparkles, Flame, PartyPopper } from 'lucide-react';
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
  const [micDenied, setMicDenied] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [soundState, setSoundState] = useState<'idle' | 'speech' | 'blowing'>('idle');

  const candlesLitRef = useRef(true);
  const holdIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Equalizer direct DOM refs for buttery 60 FPS performance without React re-renders
  const eqBarsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pillBarsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const acousticRingRef = useRef<HTMLDivElement | null>(null);

  const { playBlowCandle, playFanfare, playFirework, playGiftPop } = useAudio();

  // Sync ref with state
  useEffect(() => {
    candlesLitRef.current = candlesLit;
  }, [candlesLit]);

  // Handle extinguishing candles
  const handleExtinguish = () => {
    if (!candlesLitRef.current) return;
    candlesLitRef.current = false;
    setCandlesLit(false);
    setIsBlowing(false);
    setBlowProgress(100);

    // Cancel animation frame
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    playBlowCandle();

    setTimeout(() => {
      playFirework();
      playFanfare();
      triggerBirthdayConfetti();
      triggerContinuousConfetti(3500);
    }, 400);

    // Stop mic stream & close audio context cleanly
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicActive(false);
  };

  // Re-light candles (Inspired by birthday-cake.online)
  const handleRelight = () => {
    candlesLitRef.current = true;
    setCandlesLit(true);
    setBlowProgress(0);
    setIsBlowing(false);
    setSoundState('idle');
    playGiftPop();
  };

  // Celebration cheer (spawns extra waves of fireworks & confetti)
  const handleCheer = () => {
    playFanfare();
    playFirework();
    triggerBirthdayConfetti();
    triggerContinuousConfetti(2200);
  };

  // Start & activate microphone detection
  const startMicrophone = async () => {
    if (micActive || isRequestingMic) return;
    setIsRequestingMic(true);
    try {
      // Disable noiseSuppression & echoCancellation so physical breath turbulence isn't filtered out
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      micStreamRef.current = stream;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512; // 256 frequency bins (~86Hz/bin at 44.1kHz)
      analyser.smoothingTimeConstant = 0.12; // Fast transient response for breath
      analyserRef.current = analyser;

      // Highpass filter at 45Hz to eliminate 0Hz DC bias and microphone turn-on transient pops
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(45, ctx.currentTime);

      const source = ctx.createMediaStreamSource(stream);
      source.connect(highpass);
      highpass.connect(analyser);

      setMicActive(true);
      setMicDenied(false);
      setIsRequestingMic(false);

      const bufferLength = analyser.frequencyBinCount;
      const freqBuffer = new Uint8Array(bufferLength);
      const timeBuffer = new Uint8Array(bufferLength);
      let blowAccumulator = 0;

      // Warmup: wait 900ms after mic activation so audio hardware settles
      const readyTimestamp = Date.now() + 900;

      const barIndices = [2, 5, 8, 12, 16, 22, 28, 35, 45, 55, 68, 80, 95, 110, 130];
      const pillIndices = [4, 12, 25, 45, 75];

      const checkBlow = () => {
        if (!candlesLitRef.current || !analyserRef.current) return;

        analyser.getByteFrequencyData(freqBuffer);
        analyser.getByteTimeDomainData(timeBuffer);

        // 1. Calculate RMS volume in time domain
        let sumSq = 0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (timeBuffer[i] - 128) / 128;
          sumSq += norm * norm;
        }
        const rms = Math.sqrt(sumSq / bufferLength);

        // Update 15 visual equalizer bars directly via DOM transforms
        barIndices.forEach((bandIdx, idx) => {
          const el = eqBarsRef.current[idx];
          if (el) {
            const rawVal = (freqBuffer[bandIdx] || 0) / 200;
            const val = Math.min(1, Math.max(0.12, rawVal));
            el.style.transform = `scaleY(${val.toFixed(2)})`;
          }
        });

        // Update 5 pill equalizer bars
        pillIndices.forEach((bandIdx, idx) => {
          const el = pillBarsRef.current[idx];
          if (el) {
            const rawVal = (freqBuffer[bandIdx] || 0) / 190;
            const val = Math.min(1, Math.max(0.2, rawVal));
            el.style.transform = `scaleY(${val.toFixed(2)})`;
          }
        });

        // Update concentric acoustic ring
        if (acousticRingRef.current) {
          const normRms = Math.min(1, rms * 4.5);
          acousticRingRef.current.style.opacity = String(0.04 + normRms * 0.22);
          acousticRingRef.current.style.transform = `translate(-50%, -50%) scale(${(0.88 + normRms * 0.12).toFixed(2)})`;
        }

        // Skip detection accumulation during initial warmup period
        if (Date.now() < readyTimestamp) {
          setSoundState('idle');
          setBlowProgress(0);
          animFrameRef.current = requestAnimationFrame(checkBlow);
          return;
        }

        // 2. Wind turbulence: Bins 1 to 3 (~86Hz - 340Hz).
        const windEnergy = (freqBuffer[1] + freqBuffer[2] + freqBuffer[3]) / 3;

        // 3. Speech formant zone: Bins 5 to 22 (~430Hz - 1900Hz)
        let speechSum = 0;
        for (let i = 5; i <= 22; i++) {
          speechSum += freqBuffer[i];
        }
        const speechEnergy = speechSum / 18;

        // 4. Breath friction hiss: Bins 35 to 80 (~3000Hz - 7000Hz)
        let hissSum = 0;
        for (let i = 35; i <= 80; i++) {
          hissSum += freqBuffer[i];
        }
        const hissEnergy = hissSum / 46;

        // Total audible threshold
        const hasAudibleSound = rms > 0.04 || windEnergy > 45 || speechEnergy > 38;

        if (!hasAudibleSound) {
          // Silence or ambient background
          setSoundState('idle');
          blowAccumulator = Math.max(0, blowAccumulator - 2);
          setBlowProgress(Math.round(blowAccumulator));
          if (blowAccumulator === 0) {
            setIsBlowing(false);
          }
        } else {
          // Discriminate: Speech vs Blowing
          const isSpeech = speechEnergy > 48 && speechEnergy >= windEnergy * 0.85;

          const isBlowingAir =
            windEnergy >= 72 &&
            hissEnergy >= 24 &&
            windEnergy > speechEnergy * 1.25 &&
            !isSpeech;

          if (isBlowingAir) {
            setSoundState('blowing');
            setIsBlowing(true);
            blowAccumulator += 2.0;
            const progress = Math.min(100, Math.round(blowAccumulator));
            setBlowProgress(progress);

            if (progress >= 100) {
              handleExtinguish();
              return;
            }
          } else if (isSpeech) {
            setSoundState('speech');
            setIsBlowing(false);
            blowAccumulator = Math.max(0, blowAccumulator - 2.5);
            setBlowProgress(Math.round(blowAccumulator));
          } else {
            setSoundState('idle');
            blowAccumulator = Math.max(0, blowAccumulator - 1.8);
            setBlowProgress(Math.round(blowAccumulator));
            if (blowAccumulator === 0) {
              setIsBlowing(false);
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      animFrameRef.current = requestAnimationFrame(checkBlow);
    } catch (err) {
      console.warn('Microphone permission denied or not supported:', err);
      setMicDenied(true);
      setMicActive(false);
      setIsRequestingMic(false);
    }
  };

  // Manual fallback button (Long press / hold to extinguish - Cheat button like birthday-cake.online)
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full relative px-4 select-none">
      {/* Soft celebration fireworks when extinguished */}
      {!candlesLit && <Fireworks active={true} burstCount={4} continuous={true} />}

{/* Dynamic Header (Inspired by birthday-cake.online) */}
      <div className="px-4 mb-2 max-w-lg min-h-[72px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {candlesLit ? (
            <motion.div
              key="pre-blow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FAF4F0] tracking-tight drop-shadow-[0_4px_24px_rgba(2,6,23,0.75)]">
                Make a wish & blow out the candles
              </h1>
              <p className="text-xs sm:text-sm text-[#FAF4F0]/70 font-sans font-light leading-relaxed">
                Hãy ước một điều ước thật đẹp và thổi vào micro để dập tắt ngọn nến
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="post-blow"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white drop-shadow-[0_4px_30px_rgba(225,29,72,0.6)]">
                🎉 Happy Birthday {cfg.recipientName}!
              </h1>
              <p className="text-amber-300 font-medium text-sm sm:text-base tracking-widest animate-pulse">
                ✧ 🎂 🎊 🎉 ✨ ✧
              </p>
              <p className="text-xs text-[#FAF4F0]/75 font-serif italic">
                Ước nguyện đã được gửi gắm tới các vì sao
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Birthday Cake Stage & Concentric Acoustic Shockwaves */}
      <div className="w-full relative my-1">
        {/* Concentric Acoustic Shockwave Ring (Pulses with voice/blowing) */}
        <div
          ref={acousticRingRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 w-[85%] h-[85%] rounded-full border border-amber-400/30 transition-colors duration-200 will-change-transform"
          style={{
            opacity: 0.05,
            transform: 'translate(-50%, -50%) scale(0.88)',
            boxShadow: '0 0 35px rgba(251, 191, 36, 0.15)',
          }}
        />

        <BirthdayCake3D
          candlesLit={candlesLit}
          isBlowing={isBlowing}
          blowProgress={blowProgress}
          recipientName={cfg.recipientName}
          cakeConfig={cfg.cake}
        />
      </div>

      {/* CANDLE BLOWING INTERACTION SECTION */}
      {candlesLit ? (
        <div className="w-full px-4 flex flex-col items-center gap-2.5 mt-1 relative z-20">
          {/* Glassmorphism Mic Prompt Pill (Exact birthday-cake.online style) */}
          <div
            onClick={startMicrophone}
            role="button"
            tabIndex={0}
            className={`inline-flex items-center justify-center gap-2.5 px-5 py-2 rounded-full backdrop-blur-md border text-xs font-medium tracking-wide shadow-xl transition-all duration-300 select-none cursor-pointer max-w-[94vw] group ${
              soundState === 'blowing'
                ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-200 shadow-emerald-500/20 scale-[1.02]'
                : soundState === 'speech'
                ? 'bg-amber-950/70 border-amber-400/50 text-amber-200'
                : 'bg-slate-900/65 border-white/20 text-white/90 hover:bg-slate-800/80 hover:border-amber-400/40 active:scale-95'
            }`}
            title={micActive ? 'Microphone đang hoạt động' : 'Nhấn để mở micro thổi nến'}
          >
            {/* 5-bar animated equalizer icon */}
            <span aria-hidden="true" className="inline-flex items-center justify-center gap-[2.5px] h-4 w-5 shrink-0">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  ref={(el) => {
                    pillBarsRef.current[i] = el;
                  }}
                  className="w-[2.5px] h-full rounded-full origin-center transition-all duration-150 will-change-transform bg-amber-400"
                  style={{
                    transform: micActive ? 'scaleY(0.3)' : `scaleY(${0.25 + (i % 2) * 0.3})`,
                  }}
                />
              ))}
            </span>

            {/* Prompt Status Text */}
            <span className="truncate">
              {micDenied
                ? 'Micro bị từ chối — Hãy dùng nút gió góc phải để thổi'
                : isRequestingMic
                ? 'Đang kết nối micro...'
                : micActive
                ? soundState === 'blowing'
                  ? `Đang nhận diện hơi thổi! Giữ tiếp tục... (${blowProgress}%)`
                  : soundState === 'speech'
                  ? 'Đang nói chuyện (không tính) — Hãy thổi hơi vào mic!'
                  : 'Thổi vào micro để dập tắt ngọn nến!'
                : 'Thổi vào micro để tắt nến! (Nhấn để bật mic)'}
            </span>
          </div>

          {/* 15-Bar Bottom Equalizer (Real-time sound frequency bars) */}
          <div
            aria-hidden="true"
            className="flex items-end justify-center gap-1 h-6 px-3 transition-opacity duration-200 pointer-events-none"
            style={{ opacity: micActive ? 0.75 : 0.2 }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  eqBarsRef.current[i] = el;
                }}
                className="w-1 h-full rounded-full origin-bottom will-change-transform transition-transform duration-75"
                style={{
                  transform: 'scaleY(0.14)',
                  background: 'linear-gradient(to top, rgba(251, 191, 36, 0.7), rgba(254, 240, 138, 0.95))',
                }}
              />
            ))}
          </div>

          {/* Floating Wind Cheat Button (Bottom-Right, exactly like birthday-cake.online) */}
          <div className="fixed bottom-20 right-4 sm:right-8 z-40 flex flex-col items-center gap-1">
            <button
              type="button"
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer relative select-none group border border-white/20"
              title="Nhấn giữ để thổi tắt nến (Thủ công / Cheat)"
              aria-label="Nhấn giữ để thổi tắt nến thủ công"
            >
              {/* Circular progress SVG ring when holding */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2.5"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (113 * blowProgress) / 100}
                  className="transition-all duration-75"
                />
              </svg>
              <Wind size={18} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[10px] text-white/65 font-sans tracking-tight bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
              {blowProgress > 0 ? `${blowProgress}%` : 'Thổi thủ công'}
            </span>
          </div>
        </div>
      ) : (
        /* POST-BLOWING CELEBRATION CONTROLS (Exact birthday-cake.online layout) */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 flex flex-col items-center gap-3 mt-2"
        >
          {/* Action Button Bar */}
          <div className="flex items-center gap-3 w-full max-w-sm justify-center">
            {/* Cheer Button */}
            <button
              type="button"
              onClick={handleCheer}
              className="shrink-0 px-4 sm:px-5 py-3 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 hover:bg-slate-800/85 text-white font-bold text-xs shadow-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Tung hoa giấy chúc mừng"
            >
              <PartyPopper size={15} className="text-pink-400" />
              <span>🎉 Cheer!</span>
            </button>

            {/* Light Again Button */}
            <button
              type="button"
              onClick={handleRelight}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-full shadow-2xl shadow-pink-500/30 transition-all active:scale-95 uppercase tracking-[0.18em] text-xs flex items-center justify-center gap-2 cursor-pointer"
              title="Thắp lại nến trên bánh"
            >
              <Flame size={15} className="text-white" />
              <span>LIGHT AGAIN</span>
            </button>
          </div>

          {/* Pulse helper hint */}
          <div className="text-[11px] text-pink-200/80 font-medium animate-pulse">
            Click to light candles again
          </div>

          {/* Editorial Next Chapter Button */}
          <button
            onClick={onProceed}
            className="btn-editorial-primary px-9 py-3.5 tracking-[0.14em] text-xs uppercase gap-2 mt-1 shadow-lg"
          >
            <span>{cfg.makeAWish.continueButton}</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
