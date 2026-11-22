import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, CheckCircle2, ArrowRight, Gift, HelpCircle, Layers } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface BirthdayChallengeProps {
  onProceed: () => void;
}

export const BirthdayChallenge: React.FC<BirthdayChallengeProps> = ({ onProceed }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const { playClick, playFanfare, playGiftPop } = useAudio();
  const gameData = BIRTHDAY_CONFIG.game;

  const handleBoxSelect = (id: number) => {
    setSelectedBox(id);
    playGiftPop();
    triggerBirthdayConfetti();
    setTimeout(() => {
      setStep(2);
    }, 1600);
  };

  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
    playClick();
    setTimeout(() => {
      setStep(3);
    }, 1400);
  };

  const handleCardSelect = (id: number) => {
    setSelectedCard(id);
    playFanfare();
    triggerBirthdayConfetti();
    setTimeout(() => {
      setStep(4);
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/15 text-rose-soft text-xs font-semibold tracking-wider uppercase border border-rose-400/30 mb-2 shadow-glow-pink/20"
      >
        <Trophy size={14} className="text-champagne" />
        <span>Chương VI • Thử Thách Vui Nhộn</span>
      </motion.div>

      {/* Progress Indicator */}
      <div className="w-full max-w-xs mb-4">
        <div className="flex justify-between items-center text-xs text-lavender-muted mb-1 px-1">
          <span>Tiến độ trò chơi</span>
          <span className="text-champagne font-bold">{Math.min(step, 3)}/3</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: MYSTERY GIFT BOXES */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <h2 className="font-display text-xl sm:text-2xl font-bold text-warm-white">
              {gameData.challenge1.title}
            </h2>
            <p className="text-xs sm:text-sm text-lavender-muted mt-1 mb-6">
              {gameData.challenge1.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge1.boxes.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBoxSelect(b.id)}
                  className={`glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                    selectedBox === b.id
                      ? 'border-amber-300 bg-amber-500/20 shadow-glow-gold'
                      : 'border-white/10 hover:border-rose-400/40'
                  }`}
                >
                  <span className="text-3xl mb-2 filter drop-shadow">{b.icon}</span>
                  <span className="text-sm font-semibold text-warm-white">{b.label}</span>
                  <span className="text-[11px] text-champagne mt-1 bg-amber-400/10 px-2 py-0.5 rounded-full">
                    {b.giftTag}
                  </span>

                  {selectedBox === b.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-rose-soft font-medium italic"
                    >
                      {b.message}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: FUN WISH QUESTION */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-soft font-semibold mb-1">
              <HelpCircle size={14} />
              <span>Thử Thách 2: Điều Bạn Mong Ước</span>
            </div>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-warm-white">
              {gameData.challenge2.question}
            </h2>
            <p className="text-xs text-lavender-muted mt-1 mb-5">
              {gameData.challenge2.subtitle}
            </p>

            <div className="space-y-2.5 px-2">
              {gameData.challenge2.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`w-full p-3.5 rounded-xl glass-panel text-left flex items-center justify-between cursor-pointer border transition-all ${
                    selectedOption === opt.id
                      ? 'border-rose-400 bg-rose-500/20 shadow-glow-pink'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-warm-white block">
                      {opt.text}
                    </span>
                    {selectedOption === opt.id && (
                      <span className="text-xs text-champagne mt-1 block italic animate-fadeIn">
                        ✨ {opt.reaction}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-lavender-light/70 bg-purple-500/20 px-2 py-1 rounded-md shrink-0 ml-2">
                    {opt.scoreLabel}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: LUCKY TAROT CARD */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-champagne font-semibold mb-1">
              <Layers size={14} />
              <span>Thử Thách 3: Lá Bài May Mắn</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-warm-white">
              {gameData.challenge3.title}
            </h2>
            <p className="text-xs sm:text-sm text-lavender-muted mt-1 mb-6">
              {gameData.challenge3.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge3.cards.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardSelect(c.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
                    selectedCard === c.id
                      ? 'border-amber-300 shadow-glow-gold scale-105'
                      : 'border-white/15 hover:border-white/30'
                  } bg-gradient-to-b from-[#251543] to-[#140C25] flex flex-col items-center justify-between min-h-[170px]`}
                >
                  <span className="text-3xl mb-1 filter drop-shadow">{c.icon}</span>
                  <div>
                    <h4 className="font-display text-base font-bold text-champagne tracking-wider">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-lavender-light/80 mt-0.5">{c.subtitle}</p>
                  </div>

                  {selectedCard === c.id ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-soft mt-2 italic font-sans"
                    >
                      {c.blessing}
                    </motion.p>
                  ) : (
                    <span className="text-[11px] text-white/50 tracking-wide mt-2">
                      Chạm để lật bài
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: CHALLENGE COMPLETED */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full px-4 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-3xl shadow-glow-gold mb-3 animate-bounce">
              👑
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-warm-white text-glow-gold">
              {gameData.completedTitle}
            </h2>

            <p className="text-sm text-lavender-light/90 mt-2 max-w-sm">
              {gameData.completedMessage}
            </p>

            <button
              onClick={() => {
                playClick();
                onProceed();
              }}
              className="mt-6 px-9 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-rose-glow via-rose-600 to-lavender text-white shadow-glow-pink hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>MỞ PHONG ẤN BỨC THƯ</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
