import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Heart } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative px-4">
      {/* Editorial Chapter Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-badge mb-3"
      >
        <span>Chapter VII • The Secret Letter</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-2xl sm:text-4xl font-normal text-[#FAF4F0] tracking-tight"
      >
        {letter.title}
      </motion.h2>

      <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-1 max-w-sm mb-5 font-sans font-light">
        {letter.senderNote} • {letter.date}
      </p>

      {/* UNOPENED ENVELOPE STATE */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
            duration: 0.5,
          }}
          whileHover={{ scale: 1.04, y: -10 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenLetter}
          className="w-full max-w-sm p-8 rounded-2xl bg-[#FCFAF7] text-[#2D1117] border border-[#2D1117]/15 shadow-xl cursor-pointer flex flex-col items-center justify-center my-4 group hover:shadow-2xl transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-[#FAF4F0] border border-[#2D1117]/15 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
            <Mail size={24} className="text-[#D4627A]" />
          </div>

          <h3 className="font-serif text-xl font-semibold text-[#2D1117]">
            Bức Thư Đang Được Niêm Phong
          </h3>
          <p className="text-xs text-[#2D1117]/65 mt-1.5 font-sans font-light">
            Chạm vào đây để mở phong bì và đọc từng lời tâm tình
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF4F0] bg-[#D4627A] px-4 py-1.5 rounded-full shadow-sm">
            <span>MỞ THƯ TAY</span>
          </div>
        </motion.div>
      ) : (
        /* OPENED LETTER ON FINE ARCHIVAL STATIONERY PAPER */
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#FCFAF7] text-[#2D1117] rounded-2xl p-6 sm:p-9 border border-[#2D1117]/15 shadow-2xl text-left relative overflow-hidden"
        >
          {/* Vintage Postage Foil Stamp */}
          <div className="absolute top-5 right-5 flex items-center gap-1 text-[10px] font-sans font-semibold text-[#9E334D] bg-[#FAF4F0] px-3 py-1 rounded-full border border-[#D4627A]/30">
            <Heart size={11} className="fill-[#D4627A] text-[#D4627A]" />
            <span className="uppercase tracking-wider">For {cfg.recipientName}</span>
          </div>

          {/* Letter Salutation */}
          <div className="mb-6 pr-24">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2D1117] tracking-tight">
              Gửi {cfg.recipientName} thân mến,
            </h3>
            <p className="text-[11px] text-[#2D1117]/50 font-sans tracking-wide mt-1">{letter.date}</p>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-4 font-sans text-xs sm:text-sm text-[#2D1117]/85 font-light leading-[1.85]">
            {letter.paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className={idx === 0 ? 'drop-cap' : ''}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-5 border-t border-[#2D1117]/10 text-right">
            <p className="font-serif italic text-base text-[#2D1117]/80">
              {letter.closing}
            </p>
            <p className="font-script text-2xl sm:text-3xl text-[#D4627A] font-bold mt-1">
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
          className="w-full px-6 flex justify-center mt-5"
        >
          <button
            onClick={() => {
              playClick();
              onProceed();
            }}
            className="btn-editorial-primary px-9 py-4 tracking-[0.14em] text-xs uppercase gap-2"
          >
            <span>MÓN QUÀ BẤT NGỜ CUỐI CÙNG</span>
            <ArrowRight size={15} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
