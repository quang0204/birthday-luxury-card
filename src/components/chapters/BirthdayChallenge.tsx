import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, HelpCircle, Layers } from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface BirthdayChallengeProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const BirthdayChallenge: React.FC<BirthdayChallengeProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const { playClick, playFanfare, playGiftPop } = useAudio();
  const gameData = cfg.game;

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
      {/* Superr Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 1.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2"
      >
        <Trophy size={14} className="text-[#FBBF24]" />
        <span>Chương VI • Thử Thách Vui Nhộn</span>
      </motion.div>

      {/* Progress Indicator */}
      <div className="w-full max-w-xs mb-5">
        <div className="flex justify-between items-center text-xs text-[#F7EFE9] mb-1.5 px-1 font-display font-bold">
          <span>Tiến độ trò chơi</span>
          <span className="text-[#FBBF24] bg-[#2B1A07] px-2 py-0.5 rounded-full border border-white/20">
            {Math.min(step, 3)}/3
          </span>
        </div>
        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border-2 border-[#2B1A07] p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FBBF24] via-[#FF6F1E] to-[#FF66CF] rounded-full"
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
            <h2 className="font-display text-2xl font-black text-white">
              {gameData.challenge1.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#F7EFE9]/80 mt-1 mb-6 font-sans">
              {gameData.challenge1.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge1.boxes.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBoxSelect(b.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-[#2B1A07] shadow-sticker ${
                    selectedBox === b.id
                      ? 'bg-[#FBBF24] text-[#2B1A07] shadow-sticker-lg translate-y-[-2px]'
                      : 'bg-[#FDFBF9] text-[#2B1A07] hover:bg-[#F7EFE9]'
                  }`}
                >
                  <span className="text-4xl mb-2 filter drop-shadow">{b.icon}</span>
                  <span className="text-sm font-display font-black text-[#2B1A07]">{b.label}</span>
                  <span className="text-[11px] text-[#2B1A07] font-display font-extrabold mt-1.5 bg-[#FF66CF] px-2.5 py-0.5 rounded-full border border-[#2B1A07]">
                    {b.giftTag}
                  </span>

                  {selectedBox === b.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 text-xs text-[#2B1A07] font-bold italic font-sans"
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
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#FBBF24] font-display font-black mb-1">
              <HelpCircle size={15} />
              <span>Thử Thách 2: Điều Bạn Mong Ước</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">
              {gameData.challenge2.question}
            </h2>
            <p className="text-xs text-[#F7EFE9]/80 mt-1 mb-5 font-sans">
              {gameData.challenge2.subtitle}
            </p>

            <div className="space-y-3 px-2">
              {gameData.challenge2.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`w-full p-4 rounded-2xl text-left flex items-center justify-between cursor-pointer border-2 border-[#2B1A07] transition-all shadow-sticker ${
                    selectedOption === opt.id
                      ? 'bg-[#FF6F1E] text-white shadow-sticker-lg'
                      : 'bg-[#FDFBF9] text-[#2B1A07] hover:bg-[#F7EFE9]'
                  }`}
                >
                  <div>
                    <span className="text-sm font-display font-bold block">
                      {opt.text}
                    </span>
                    {selectedOption === opt.id && (
                      <span className="text-xs text-[#FDFBF9] mt-1 block italic animate-fadeIn font-sans font-medium">
                        ✨ {opt.reaction}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-display font-black px-2.5 py-1 rounded-full border border-[#2B1A07] shrink-0 ml-2 ${
                      selectedOption === opt.id
                        ? 'bg-[#FDFBF9] text-[#2B1A07]'
                        : 'bg-[#FF66CF] text-[#2B1A07]'
                    }`}
                  >
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
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#FBBF24] font-display font-black mb-1">
              <Layers size={15} />
              <span>Thử Thách 3: Lá Bài May Mắn</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white">
              {gameData.challenge3.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#F7EFE9]/80 mt-1 mb-6 font-sans">
              {gameData.challenge3.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge3.cards.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardSelect(c.id)}
                  className={`relative p-5 rounded-3xl cursor-pointer transition-all border-2.5 border-[#2B1A07] flex flex-col items-center justify-between min-h-[180px] shadow-sticker ${
                    selectedCard === c.id
                      ? 'bg-[#FBBF24] text-[#2B1A07] shadow-sticker-lg scale-105'
                      : 'bg-[#FDFBF9] text-[#2B1A07] hover:bg-[#F7EFE9]'
                  }`}
                >
                  <span className="text-4xl mb-1 filter drop-shadow">{c.icon}</span>
                  <div>
                    <h4 className="font-display text-base font-black tracking-wide text-[#2B1A07]">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-[#2B1A07]/75 font-sans mt-0.5">{c.subtitle}</p>
                  </div>

                  {selectedCard === c.id ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[#2B1A07] font-bold mt-2 italic font-sans"
                    >
                      {c.blessing}
                    </motion.p>
                  ) : (
                    <span className="text-[11px] font-display font-extrabold text-[#FF6F1E] bg-[#FF6F1E]/10 px-2.5 py-0.5 rounded-full border border-[#FF6F1E]/40 mt-2">
                      Lật mở lá bài
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
            <div className="w-18 h-18 rounded-full bg-[#FBBF24] border-2.5 border-[#2B1A07] shadow-sticker flex items-center justify-center text-4xl mb-4 animate-bounce">
              👑
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white text-glow-sunshine">
              {gameData.completedTitle}
            </h2>

            <p className="text-sm text-[#F7EFE9]/90 mt-2 max-w-sm font-sans">
              {gameData.completedMessage}
            </p>

            <button
              onClick={() => {
                playClick();
                onProceed();
              }}
              className="superr-btn-primary mt-6 px-9 py-4 text-base gap-2"
            >
              <span>MỞ PHONG ẤN BỨC THƯ</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
