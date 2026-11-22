import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, ArrowRight, BookOpen } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';

interface SecretLetterProps {
  onProceed: () => void;
}

export const SecretLetter: React.FC<SecretLetterProps> = ({ onProceed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playEnvelopeOpen, playClick } = useAudio();
  const letter = BIRTHDAY_CONFIG.secretLetter;

  const handleOpenLetter = () => {
    setIsOpen(true);
    playEnvelopeOpen();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/15 text-rose-soft text-xs font-semibold tracking-wider uppercase border border-rose-400/30 mb-2 shadow-glow-pink/20"
      >
        <Mail size={14} className="text-champagne" />
        <span>Chương VII • Bức Thư Bí Mật</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl sm:text-3xl font-bold text-warm-white text-glow-pink"
      >
        {letter.title}
      </motion.h2>

      <p className="text-xs sm:text-sm text-lavender-muted mt-1 max-w-sm mb-5">
        {letter.senderNote} • {letter.date}
      </p>

      {/* UNOPENED ENVELOPE STATE */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleOpenLetter}
          className="w-full max-w-sm p-8 rounded-2xl glass-card-interactive cursor-pointer flex flex-col items-center justify-center border-2 border-rose-300/40 shadow-glow-pink/30 my-4 group"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3">
            <Mail size={28} className="text-white" />
          </div>

          <h3 className="font-display text-lg font-bold text-warm-white">
            Bức Thư Đang Được Niêm Phong
          </h3>
          <p className="text-xs text-rose-soft/80 mt-1">
            Chạm vào đây để mở phong bì và đọc từng lời tâm tình
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-champagne bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/30">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>MỞ THƯ TAY</span>
          </div>
        </motion.div>
      ) : (
        /* OPENED HANDWRITTEN LETTER VENEER */
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#FFFDF9] text-neutral-900 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.65)] border border-amber-200 text-left relative overflow-hidden"
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#998_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Golden stamp corner */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-sans text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300/50">
            <Heart size={12} className="text-rose-600 fill-rose-600" />
            <span>For {BIRTHDAY_CONFIG.recipientName}</span>
          </div>

          {/* Letter header */}
          <div className="mb-4 pr-16">
            <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-700">
              Gửi {BIRTHDAY_CONFIG.recipientName} thân mến,
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">{letter.date}</p>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed">
            {letter.paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Signoff */}
          <div className="mt-6 pt-4 border-t border-neutral-200 text-right">
            <p className="font-handwriting text-xl text-neutral-800 font-bold">
              {letter.closing}
            </p>
            <p className="text-xs text-rose-600 font-semibold font-sans mt-0.5">
              {letter.signOff}
            </p>
          </div>
        </motion.div>
      )}

      {/* Button to Proceed to Final Surprise */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full px-6 flex justify-center mt-6"
        >
          <button
            onClick={() => {
              playClick();
              onProceed();
            }}
            className="w-full sm:w-auto px-9 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-glow-gold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>MÓN QUÀ BẤT NGỜ CUỐI CÙNG</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
