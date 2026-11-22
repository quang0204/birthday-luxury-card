import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Wind, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
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

  const { playBlowCandle, playFanfare, playFirework } = useAudio();

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

  // Start & activate microphone detection
  const startMicrophone = async () => {
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

      // Warmup: wait 1000ms after mic activation so audio hardware settles
      const readyTimestamp = Date.now() + 1000;

      const checkBlow = () => {
        if (!candlesLitRef.current || !analyserRef.current) return;

        // Skip during initial 1000ms calibration period
        if (Date.now() < readyTimestamp) {
          setSoundState('idle');
          setBlowProgress(0);
          animFrameRef.current = requestAnimationFrame(checkBlow);
          return;
        }

        analyser.getByteFrequencyData(freqBuffer);
        analyser.getByteTimeDomainData(timeBuffer);

        // 1. Calculate RMS volume in time domain
        let sumSq = 0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (timeBuffer[i] - 128) / 128;
          sumSq += norm * norm;
        }
        const rms = Math.sqrt(sumSq / bufferLength);

        // 2. Wind turbulence: Bins 1 to 3 (~86Hz - 340Hz).
        // NOTE: Bin 0 is strictly excluded because it represents DC offset (0 Hz)!
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
          // Speech characteristic:
          // Speech formant energy is high, and formants are close to or exceed wind turbulence
          const isSpeech = speechEnergy > 48 && speechEnergy >= windEnergy * 0.85;

          // Blowing characteristic:
          // Exhaled air jet hitting the mic capsule MUST create:
          // 1. High wind turbulence (windEnergy >= 72)
          // 2. High-frequency breath friction hiss (hissEnergy >= 24)
          // 3. Wind energy outpaces speech formant energy (> 1.25x)
          // 4. Not speech
          const isBlowingAir =
            windEnergy >= 72 &&
            hissEnergy >= 24 &&
            windEnergy > speechEnergy * 1.25 &&
            !isSpeech;

          if (isBlowingAir) {
            setSoundState('blowing');
            setIsBlowing(true);
            // Steady accumulation: ~1.0 - 1.2s of continuous sustained blowing (at 60fps, +1.8 per frame)
            blowAccumulator += 1.8;
            const progress = Math.min(100, Math.round(blowAccumulator));
            setBlowProgress(progress);

            if (progress >= 100) {
              handleExtinguish();
              return;
            }
          } else if (isSpeech) {
            setSoundState('speech');
            setIsBlowing(false);
            // Decay progress during speech so talking CANNOT blow out candles
            blowAccumulator = Math.max(0, blowAccumulator - 2.5);
            setBlowProgress(Math.round(blowAccumulator));
          } else {
            // General ambient noise
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

  // Manual fallback (ONLY used if mic access is denied or device has no mic hardware)
  const startHolding = () => {
    if (!candlesLit) return;
    setIsBlowing(true);
    let current = blowProgress;
    holdIntervalRef.current = window.setInterval(() => {
      current += 5;
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative px-4">
      {/* Soft celebration fireworks when extinguished */}
      {!candlesLit && <Fireworks active={true} burstCount={4} continuous={true} />}

      {/* Editorial Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-badge mb-3"
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
          {candlesLit ? cfg.makeAWish.title : cfg.makeAWish.blownTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-2 font-sans font-light leading-relaxed">
          {candlesLit
            ? micActive
              ? 'Hãy ghé sát miệng và thổi một luồng hơi thật mạnh vào micro để tắt nến!'
              : 'Hãy bật micro và thổi một luồng hơi trực tiếp vào mic để dập tắt nến sinh nhật.'
            : cfg.makeAWish.blownSubtitle}
        </p>
      </motion.div>

      {/* 3D Birthday Cake (Note: Direct click to extinguish is intentionally disabled) */}
      <div className="w-full relative my-2">
        <BirthdayCake3D
          candlesLit={candlesLit}
          isBlowing={isBlowing}
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
        <div className="w-full px-4 flex flex-col items-center gap-3 mt-3">
          {/* STATE 1: Mic not yet enabled (Mandatory Prompt + Tactile Manual Fallback) */}
          {!micActive && !micDenied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2.5 w-full sm:w-84"
            >
              <button
                onClick={startMicrophone}
                disabled={isRequestingMic}
                className="btn-luxury w-full py-4 px-6 rounded-full font-sans font-bold text-xs sm:text-sm tracking-[0.12em] uppercase bg-[#D4627A] hover:bg-[#C2526A] text-white flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group"
              >
                <Mic size={18} className="text-white group-hover:scale-110 transition-transform animate-pulse" />
                <span>{isRequestingMic ? 'Đang mở micro...' : 'Bật Micro Để Thổi Nến'}</span>
              </button>

              {/* Accessible Manual Hold Option for noisy environments or in-app webviews */}
              <button
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                className="w-full py-2.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/15 text-white/80 hover:text-white text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                title="Nhấn giữ nút này trong khoảng 1 giây để thổi nến bằng tay"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Hoặc nhấn giữ đây để thổi bằng tay</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F0]/5 border border-[#FAF4F0]/15 rounded-full text-xs text-[#FAF4F0]/70 font-sans text-center max-w-sm">
                <span>🌬️</span>
                <span>Thổi trực tiếp vào micro hoặc nhấn giữ nút để dập tắt nến</span>
              </div>
            </motion.div>
          )}

          {/* STATE 2: Mic is active (Interactive Wind & Breath Analyzer) */}
          {micActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full sm:w-88 flex flex-col items-center gap-3 bg-[#FAF4F0]/5 border border-[#FAF4F0]/15 rounded-2xl p-4 backdrop-blur-md shadow-2xl"
            >
              {/* Dynamic status feedback pill */}
              <div className="min-h-[28px] flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                  {soundState === 'blowing' ? (
                    <motion.div
                      key="blowing"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold shadow-sm"
                    >
                      <Wind size={14} className="animate-pulse" />
                      <span>Đang nhận diện hơi thổi! Giữ tiếp tục...</span>
                    </motion.div>
                  ) : soundState === 'speech' ? (
                    <motion.div
                      key="speech"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-200 text-xs font-semibold"
                    >
                      <span>🗣️</span>
                      <span>Đang nói chuyện (không tính) — Hãy thổi hơi vào mic!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF4F0]/10 border border-[#FAF4F0]/15 rounded-full text-[#FAF4F0]/75 text-xs"
                    >
                      <Mic size={13} className="text-[#E77C92] animate-pulse" />
                      <span>Micro đang lắng nghe... Thổi một luồng hơi vào mic</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wind Gauge Progress Bar */}
              <div className="w-full bg-black/40 h-3.5 rounded-full overflow-hidden border border-[#FAF4F0]/20 p-0.5 relative shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-[#D4627A] via-[#E6C29C] to-emerald-400 shadow-[0_0_12px_rgba(230,194,156,0.6)]"
                  style={{ width: `${blowProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[11px] text-[#FAF4F0]/60 font-sans">
                <span className="font-semibold text-[#FAF4F0]/80">Lực thổi: {blowProgress}%</span>
                <span>Thổi giữ ~1s để nến tắt</span>
              </div>
            </motion.div>
          )}

          {/* STATE 3: Mic access denied / unsupported fallback */}
          {micDenied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 w-full sm:w-80"
            >
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-amber-200 text-xs text-left">
                <AlertCircle size={18} className="shrink-0 text-amber-300" />
                <span>Không thể truy cập micro trên thiết bị này. Bạn có thể dùng nút nhấn giữ bên dưới để thổi nến:</span>
              </div>

              <button
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                className="relative overflow-hidden w-full px-8 py-3.5 rounded-full font-sans font-bold text-xs tracking-[0.14em] uppercase bg-[#FAF4F0]/10 text-white border border-[#FAF4F0]/25 shadow-lg select-none cursor-pointer flex items-center justify-center gap-2 group transition-all"
              >
                <div
                  className="absolute inset-0 bg-[#E6C29C] transition-all duration-75 pointer-events-none opacity-90"
                  style={{ width: `${blowProgress}%` }}
                />
                <Wind size={16} className="relative z-10 text-white" />
                <span className="relative z-10 text-white">
                  {blowProgress > 0 ? `Đang Thổi Thủ Công... ${blowProgress}%` : 'Nhấn Giữ Để Thổi Nến'}
                </span>
              </button>

              <button
                onClick={startMicrophone}
                className="text-[11px] text-[#E77C92] underline underline-offset-2 hover:text-[#FAF4F0] cursor-pointer"
              >
                Thử kết nối lại micro
              </button>
            </motion.div>
          )}
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
