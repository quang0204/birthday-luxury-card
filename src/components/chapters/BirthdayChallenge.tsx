import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative px-4">
      {/* Editorial Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-badge mb-3"
      >
        <span>Chapter VI • Three Whimsical Challenges</span>
      </motion.div>

      {/* Slender Minimalist Progress Indicator */}
      <div className="w-full max-w-xs mb-6">
        <div className="flex justify-between items-center text-[11px] text-[#FAF4F0]/60 mb-2 px-1 font-sans tracking-widest uppercase">
          <span>Tiến độ thử thách</span>
          <span className="text-[#E77C92] font-semibold">
            {Math.min(step, 3)} / 3
          </span>
        </div>
        <div className="w-full h-1 bg-[#FAF4F0]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4627A] to-[#E6C29C] rounded-full"
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF4F0] tracking-tight">
              {gameData.challenge1.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-1.5 mb-6 font-sans font-light">
              {gameData.challenge1.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge1.boxes.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBoxSelect(b.id)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                    selectedBox === b.id
                      ? 'bg-[#FCFAF7] text-[#2D1117] border-[#D4627A] shadow-xl'
                      : 'bg-[#FCFAF7]/95 text-[#2D1117] border-[#2D1117]/15 hover:bg-white shadow-md'
                  }`}
                >
                  <span className="text-3xl mb-2">{b.icon}</span>
                  <span className="text-sm font-serif font-semibold text-[#2D1117]">{b.label}</span>
                  <span className="text-[10px] text-[#D4627A] font-sans font-bold uppercase tracking-wider mt-1.5 bg-[#FAF4F0] px-2.5 py-0.5 rounded-full border border-[#D4627A]/30">
                    {b.giftTag}
                  </span>

                  {selectedBox === b.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-[#2D1117]/85 font-serif italic"
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E77C92] font-sans font-medium mb-1">
              <HelpCircle size={14} />
              <span>Thử Thách 2: Điều Bạn Mong Ước</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#FAF4F0] tracking-tight">
              {gameData.challenge2.question}
            </h2>
            <p className="text-xs text-[#FAF4F0]/65 mt-1.5 mb-5 font-sans font-light">
              {gameData.challenge2.subtitle}
            </p>

            <div className="space-y-2.5 px-2">
              {gameData.challenge2.options.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`w-full p-4 rounded-xl text-left flex items-center justify-between cursor-pointer border transition-all ${
                    selectedOption === opt.id
                      ? 'bg-[#D4627A] text-white border-white/30 shadow-lg'
                      : 'bg-[#FCFAF7] text-[#2D1117] border-[#2D1117]/15 hover:bg-white shadow-sm'
                  }`}
                >
                  <div>
                    <span className="text-sm font-serif font-medium block">
                      {opt.text}
                    </span>
                    {selectedOption === opt.id && (
                      <span className="text-xs text-white/90 mt-1 block italic font-serif">
                        ✦ {opt.reaction}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ml-2 ${
                      selectedOption === opt.id
                        ? 'bg-white text-[#D4627A] border-transparent'
                        : 'bg-[#FAF4F0] text-[#D4627A] border-[#D4627A]/25'
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#E6C29C] font-sans font-medium mb-1">
              <Sparkles size={14} />
              <span>Thử Thách 3: Lá Bài May Mắn</span>
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#FAF4F0] tracking-tight">
              {gameData.challenge3.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-1.5 mb-6 font-sans font-light">
              {gameData.challenge3.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 px-2">
              {gameData.challenge3.cards.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCardSelect(c.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all border flex flex-col items-center justify-between min-h-[180px] ${
                    selectedCard === c.id
                      ? 'bg-[#FCFAF7] text-[#2D1117] border-[#E6C29C] shadow-2xl scale-105'
                      : 'bg-[#FCFAF7]/95 text-[#2D1117] border-[#2D1117]/15 hover:bg-white shadow-md'
                  }`}
                >
                  <span className="text-3xl mb-1">{c.icon}</span>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#2D1117]">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-[#2D1117]/65 font-sans mt-0.5">{c.subtitle}</p>
                  </div>

                  {selectedCard === c.id ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[#D4627A] font-serif italic mt-2 leading-relaxed"
                    >
                      {c.blessing}
                    </motion.p>
                  ) : (
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#D4627A] bg-[#FAF4F0] px-2.5 py-0.5 rounded-full border border-[#D4627A]/25 mt-2">
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
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full px-4 flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#FAF4F0]/10 border border-[#FAF4F0]/25 backdrop-blur-md flex items-center justify-center text-2xl mb-4">
              <Trophy size={24} className="text-[#E6C29C]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF4F0] tracking-tight">
              {gameData.completedTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#FAF4F0]/70 mt-2 max-w-sm font-sans font-light leading-relaxed">
              {gameData.completedMessage}
            </p>

            <button
              onClick={() => {
                playClick();
                onProceed();
              }}
              className="btn-editorial-primary mt-6 px-9 py-4 tracking-[0.14em] text-xs uppercase gap-2"
            >
              <span>MỞ PHONG ẤN BỨC THƯ</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
