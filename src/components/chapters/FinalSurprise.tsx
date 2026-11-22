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
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-3xl shadow-glow-pink animate-pulse mb-4">
            🎁
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-warm-white">
            {surprise.preTitle}
          </h2>

          <p className="text-sm text-lavender-muted mt-2 max-w-xs sm:max-w-sm">
            Còn một điều bất ngờ cuối cùng được giữ lại tới phút chót...
          </p>

          <button
            onClick={handleReveal}
            className="mt-6 px-9 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-glow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={18} />
            <span>KHÁM PHÁ MÓN QUÀ CUỐI CÙNG</span>
            <Sparkles size={18} />
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
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-400 flex items-center justify-center shadow-glow-pink mb-4"
          >
            <Heart size={32} className="text-white fill-white" />
          </motion.div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-glow via-warm-white to-champagne text-glow-pink">
            HAPPY BIRTHDAY, {cfg.recipientName.toUpperCase()}!
          </h1>

          {/* Warm closing emotional card */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-300/30 my-6 shadow-2xl max-w-md w-full text-center">
            <p className="font-serif italic text-base sm:text-lg text-amber-200 font-medium">
              "{surprise.closingQuote}"
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              {surprise.wishes.map((w, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-lavender-light">
                  {w}
                </p>
              ))}
            </div>

            <p className="text-xs text-rose-soft/90 mt-5 font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5">
              <Heart size={13} className="text-rose-500 fill-rose-500" />
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
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl glass-card-interactive flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-rose-soft cursor-pointer"
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
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl glass-card-interactive flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-rose-soft cursor-pointer"
            >
              <Image size={16} />
              <span>Xem Kỷ Niệm</span>
            </button>

            {/* Share Surprise */}
            <button
              onClick={handleShare}
              className="w-full sm:w-auto flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-lavender text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-pink hover:scale-102 transition-all cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-300" /> : <Share2 size={16} />}
              <span>{copied ? 'Đã sao chép link!' : 'Lưu & Chia Sẻ'}</span>
            </button>

            {/* Print Card & QR Page (Only for Creator mode) */}
            {!isRecipientMode && (
              <button
                onClick={() => {
                  playClick();
                  onOpenQRModal();
                }}
                className="w-full px-4 py-3 rounded-xl glass-panel text-champagne border border-amber-300/40 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-amber-400/10 transition-all cursor-pointer"
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
                className="w-full mt-1 px-4 py-2.5 rounded-xl border border-rose-400/30 text-rose-soft text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <PenTool size={14} />
                <span>Tự Tạo Thiệp Riêng Của Bạn</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
