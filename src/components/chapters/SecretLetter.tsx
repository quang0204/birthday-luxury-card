import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';

interface SecretLetterProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const SecretLetter: React.FC<SecretLetterProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [isOpen, setIsOpen] = useState(false);
  const { playEnvelopeOpen, playClick } = useAudio();
  const letter = cfg.secretLetter;

  const handleOpenLetter = () => {
    setIsOpen(true);
    playEnvelopeOpen();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Superr Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6F1E] text-white border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2"
      >
        <Mail size={14} className="text-[#FBBF24]" />
        <span>Chương VII • Bức Thư Bí Mật</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl sm:text-3xl font-black text-white text-glow-marker"
      >
        {letter.title}
      </motion.h2>

      <p className="text-xs sm:text-sm text-[#F7EFE9]/80 mt-1 max-w-sm mb-5 font-sans">
        {letter.senderNote} • {letter.date}
      </p>

      {/* UNOPENED ENVELOPE STATE */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleOpenLetter}
          className="w-full max-w-sm p-8 rounded-3xl bg-[#FDFBF9] text-[#2B1A07] border-2.5 border-[#2B1A07] shadow-sticker-lg cursor-pointer flex flex-col items-center justify-center my-4 group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <div className="w-18 h-18 rounded-full bg-[#FF6F1E] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Mail size={32} className="text-white" />
          </div>

          <h3 className="font-display text-xl font-black text-[#2B1A07]">
            Bức Thư Đang Được Niêm Phong
          </h3>
          <p className="text-xs text-[#2B1A07]/80 mt-1 font-sans">
            Chạm vào đây để mở phong bì và đọc từng lời tâm tình
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-display font-extrabold text-[#2B1A07] bg-[#FBBF24] px-4 py-1.5 rounded-full border-2 border-[#2B1A07] shadow-sticker-sm">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>MỞ THƯ TAY</span>
          </div>
        </motion.div>
      ) : (
        /* OPENED HANDWRITTEN LETTER VENEER (Superr Cream Paper & Cocoa Ink) */
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#FDFBF9] text-[#2B1A07] rounded-3xl p-6 sm:p-8 border-2.5 border-[#2B1A07] shadow-sticker-lg text-left relative overflow-hidden"
        >
          {/* Sticker corner stamp */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-display font-black text-[#2B1A07] bg-[#FF66CF] px-3 py-1 rounded-full border-2 border-[#2B1A07] shadow-sticker-sm transform rotate-2">
            <Heart size={14} className="text-[#2B1A07] fill-[#2B1A07]" />
            <span>For {cfg.recipientName}</span>
          </div>

          {/* Letter header */}
          <div className="mb-5 pr-20">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#FF6F1E]">
              Gửi {cfg.recipientName} thân mến,
            </h3>
            <p className="text-xs text-[#2B1A07]/60 font-sans mt-0.5">{letter.date}</p>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-3.5 font-sans text-xs sm:text-sm text-[#2B1A07] leading-relaxed">
            {letter.paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Signoff */}
          <div className="mt-6 pt-4 border-t-2 border-[#2B1A07]/15 text-right">
            <p className="font-display text-xl text-[#2B1A07] font-black">
              {letter.closing}
            </p>
            <p className="text-base text-[#FF6F1E] font-handwriting font-bold mt-0.5">
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full px-6 flex justify-center mt-6"
        >
          <button
            onClick={() => {
              playClick();
              onProceed();
            }}
            className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2"
          >
            <span>MÓN QUÀ BẤT NGỜ CUỐI CÙNG</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
