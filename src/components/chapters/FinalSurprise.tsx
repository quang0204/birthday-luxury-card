import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, Heart, Sparkles, Image, QrCode, Check, PenTool } from 'lucide-react';
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
  onOpenCreator,
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
    triggerContinuousConfetti(5000);
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
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Continuous Grand Celebration Fireworks when revealed */}
      {isRevealed && <Fireworks active={true} burstCount={6} continuous={true} />}

      {!isRevealed ? (
        /* BEFORE REVEAL: MYSTERY CURIOSITY */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center px-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#FF6F1E] border-2.5 border-[#2B1A07] shadow-sticker flex items-center justify-center text-4xl mb-4 animate-bounce">
            🎁
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {surprise.preTitle}
          </h2>

          <p className="text-sm text-[#F7EFE9]/80 mt-2 max-w-xs sm:max-w-sm font-sans">
            Còn một điều bất ngờ cuối cùng được giữ lại tới phút chót...
          </p>

          <button
            onClick={handleReveal}
            className="superr-btn-primary mt-6 px-9 py-4 text-base gap-2"
          >
            <Sparkles size={20} />
            <span>KHÁM PHÁ MÓN QUÀ CUỐI CÙNG</span>
            <Sparkles size={20} />
          </button>
        </motion.div>
      ) : (
        /* AFTER REVEAL: GRAND FINALE SPECTACLE */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center px-2"
        >
          {/* Top Sparkling Heart */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="w-18 h-18 rounded-full bg-[#FF66CF] border-2.5 border-[#2B1A07] shadow-sticker flex items-center justify-center mb-4"
          >
            <Heart size={34} className="text-[#2B1A07] fill-[#2B1A07]" />
          </motion.div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white text-glow-marker">
            HAPPY BIRTHDAY, {cfg.recipientName.toUpperCase()}!
          </h1>

          {/* Superr Warm Card */}
          <div className="bg-[#FDFBF9] text-[#2B1A07] p-6 sm:p-7 rounded-3xl border-2.5 border-[#2B1A07] shadow-sticker-lg my-6 max-w-md w-full text-center">
            <p className="font-display font-bold text-base sm:text-lg text-[#CE500A]">
              "{surprise.closingQuote}"
            </p>

            <div className="mt-4 pt-4 border-t-2 border-[#2B1A07]/10 flex flex-col gap-2 font-sans">
              {surprise.wishes.map((w, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[#2B1A07]/80 font-medium">
                  {w}
                </p>
              ))}
            </div>

            <p className="text-xs text-[#2B1A07] font-display font-black mt-5 tracking-wider uppercase flex items-center justify-center gap-1.5 bg-[#FBBF24] py-1 px-3 rounded-full border border-[#2B1A07] shadow-[1px_1px_0px_#2B1A07] mx-auto w-fit">
              <Heart size={14} className="text-[#FF66CF] fill-[#FF66CF]" />
              <span>{surprise.credit}</span>
            </p>
          </div>

          {/* Action Button Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md px-2">
            {/* Replay Button */}
            <button
              onClick={() => {
                playClick();
                onReplay();
              }}
              className="superr-btn-secondary flex-1 min-w-[140px] px-4 py-3.5 text-xs sm:text-sm gap-2"
            >
              <RotateCcw size={16} />
              <span>Xem Lại Từ Đầu</span>
            </button>

            {/* View Memories */}
            <button
              onClick={() => {
                playClick();
                onGoToMemories();
              }}
              className="superr-btn-secondary flex-1 min-w-[140px] px-4 py-3.5 text-xs sm:text-sm gap-2"
            >
              <Image size={16} />
              <span>Xem Kỷ Niệm</span>
            </button>

            {/* Share Surprise */}
            <button
              onClick={handleShare}
              className="superr-btn-primary w-full sm:w-auto flex-1 min-w-[140px] px-4 py-3.5 text-xs sm:text-sm gap-2"
            >
              {copied ? <Check size={16} className="text-[#22C55E]" /> : <Share2 size={16} />}
              <span>{copied ? 'Đã sao chép link!' : 'Lưu & Chia Sẻ'}</span>
            </button>

            {/* Print Card & QR Page (Only for Creator mode) */}
            {!isRecipientMode && (
              <button
                onClick={() => {
                  playClick();
                  onOpenQRModal();
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#FBBF24] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <QrCode size={16} />
                <span>Thiệp Giấy & Tải Mã QR In</span>
              </button>
            )}

            {/* Create Another Card CTA (Only for Creator mode) */}
            {!isRecipientMode && onOpenCreator && (
              <button
                onClick={() => {
                  playClick();
                  onOpenCreator();
                }}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker font-display font-black text-xs flex items-center justify-center gap-2 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <PenTool size={15} />
                <span>Tự Tạo Thiệp Riêng Của Bạn</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
