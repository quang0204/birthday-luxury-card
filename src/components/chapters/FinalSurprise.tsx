import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, Sparkles, Image, Check, QrCode } from 'lucide-react';
import { Fireworks } from '../common/Fireworks';
import { BirthdayConfig, BIRTHDAY_CONFIG } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { triggerBirthdayConfetti, triggerContinuousConfetti } from '../../utils/animation';

interface FinalSurpriseProps {
  config?: BirthdayConfig;
  isRecipientMode?: boolean;
  onReplay: () => void;
  onGoToMemories: () => void;
  onOpenQRModal: () => void;
  onOpenCreator?: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  config,
  isRecipientMode = false,
  onReplay,
  onGoToMemories,
  onOpenQRModal,
}) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { playGiftPop, playFanfare, playFirework, playClick } = useAudio();
  const surprise = cfg.finalSurprise;

  const handleReveal = () => {
    setIsRevealed(true);
    playGiftPop();
    playFirework();
    playFanfare();
    triggerBirthdayConfetti();
    triggerContinuousConfetti(4500);
  };

  const handleShare = async () => {
    playClick();
    const shareData = {
      title: surprise.shareTitle,
      text: surprise.shareText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        window.prompt('Sao chép đường link này để lưu lại:', window.location.href);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative px-4">
      {/* Celebration Fireworks when revealed */}
      {isRevealed && <Fireworks active={true} burstCount={5} continuous={true} />}

{!isRevealed ? (
        /* BEFORE REVEAL: MYSTERY CURIOSITY */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-[#FAF4F0]/10 border border-[#FAF4F0]/25 backdrop-blur-md flex items-center justify-center text-2xl mb-4 shadow-[0_0_25px_rgba(230,194,156,0.3)]"
          >
            <Sparkles size={26} className="text-[#E6C29C] animate-spin-slow" />
          </motion.div>

          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#FAF4F0] tracking-tight">
            {surprise.preTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-2 max-w-xs sm:max-w-sm font-sans font-light leading-relaxed">
            Còn một điều bất ngờ cuối cùng được lưu giữ lại tới phút chót...
          </p>

          <button
            onClick={handleReveal}
            className="btn-editorial-primary mt-6 px-9 py-4 tracking-[0.14em] text-xs uppercase gap-2"
          >
            <span>KHÁM PHÁ MÓN QUÀ CUỐI CÙNG</span>
            <Sparkles size={16} />
          </button>
        </motion.div>
      ) : (
        /* AFTER REVEAL: GRAND FINALE KEEPSAKE */
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center px-2"
        >
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#E77C92] font-semibold mb-2">
            The Final Keepsake
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF4F0] tracking-tight leading-tight">
            HAPPY BIRTHDAY, {cfg.recipientName.toUpperCase()}!
          </h1>

          {/* Archival Keepsake Card */}
          <div className="bg-[#FCFAF7] text-[#2D1117] p-6 sm:p-8 rounded-2xl border border-[#2D1117]/15 shadow-2xl my-6 max-w-md w-full text-center">
            <p className="font-serif italic text-base sm:text-lg text-[#D4627A] leading-snug">
              "{surprise.closingQuote}"
            </p>

            <div className="mt-4 pt-4 border-t border-[#2D1117]/10 flex flex-col gap-2.5 font-sans">
              {surprise.wishes.map((w, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[#2D1117]/80 font-light leading-relaxed">
                  {w}
                </p>
              ))}
            </div>

            <p className="text-[11px] text-[#2D1117] font-sans font-semibold mt-5 tracking-wider uppercase flex items-center justify-center gap-1.5 bg-[#FAF4F0] py-1 px-3 rounded-full border border-[#D4627A]/25 mx-auto w-fit">
              <span>{surprise.credit}</span>
            </p>
          </div>

          {/* Action Button Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md px-2">
            {/* Replay Button */}
            <button
              onClick={() => {
                playClick();
                onReplay();
              }}
              className="btn-editorial-secondary flex-1 min-w-[130px] px-4 py-3 text-xs gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Xem Lại Từ Đầu</span>
            </button>

            {/* View Memories */}
            <button
              onClick={() => {
                playClick();
                onGoToMemories();
              }}
              className="btn-editorial-secondary flex-1 min-w-[130px] px-4 py-3 text-xs gap-1.5"
            >
              <Image size={14} />
              <span>Xem Kỷ Niệm</span>
            </button>

            {/* Share Surprise */}
            <button
              onClick={handleShare}
              className="btn-editorial-primary w-full sm:w-auto flex-1 min-w-[130px] px-4 py-3 text-xs gap-1.5"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'Đã sao chép link!' : 'Lưu & Chia Sẻ'}</span>
            </button>

            {/* Print Card & QR Modal (Only for Creator mode) */}
            {!isRecipientMode && (
              <button
                onClick={() => {
                  playClick();
                  onOpenQRModal();
                }}
                className="w-full mt-1 px-4 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-[#FAF4F0]/10 hover:bg-[#FAF4F0]/15 text-[#FAF4F0] border border-[#FAF4F0]/20 transition-all cursor-pointer"
              >
                <QrCode size={14} />
                <span>Xem Mã QR & In Thiệp Vật Lý</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
