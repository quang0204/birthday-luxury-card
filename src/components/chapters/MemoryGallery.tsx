import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG, MemoryItem } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';

interface MemoryGalleryProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const memories = cfg.memories;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<MemoryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const { playClick } = useAudio();

  const nextMemory = () => {
    playClick();
    setActiveIndex((prev) => (prev + 1) % memories.length);
  };

  const prevMemory = () => {
    playClick();
    setActiveIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentItem = memories[activeIndex] || memories[0];

  if (!currentItem) {
    return (
      <div className="text-center p-8">
        <p>Chưa có kỷ niệm nào. Hãy thêm ảnh trong phần tạo thiệp nhé!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full relative">
      {/* Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/15 text-rose-soft text-xs font-semibold tracking-wider uppercase border border-rose-400/30 mb-2 shadow-glow-pink/20"
      >
        <Sparkles size={14} className="text-champagne" />
        <span>Chương V • Cuốn Sổ Kỷ Niệm</span>
        <Sparkles size={14} className="text-champagne" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl sm:text-3xl font-bold text-warm-white text-glow-pink"
      >
        Những Khoảnh Khắc Đẹp Nhất
      </motion.h2>

      <p className="text-xs sm:text-sm text-lavender-muted mt-1 max-w-sm">
        Mỗi tấm ảnh là một kỷ niệm vô giá mà chúng mình đã cùng nhau lưu giữ.
      </p>

      {/* POLAROID SCRAPBOOK DECK */}
      <div className="relative w-full max-w-xs sm:max-w-sm my-6 h-[400px] flex items-center justify-center">
        {/* Decorative Washi Tape on top */}
        <div className="absolute -top-3 z-30 w-24 h-7 bg-amber-100/70 backdrop-blur-sm -rotate-3 border-y border-amber-300/40 shadow-sm" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id || activeIndex}
            initial={{ opacity: 0, scale: 0.9, rotate: (currentItem.rotation || 0) - 5 }}
            animate={{ opacity: 1, scale: 1, rotate: currentItem.rotation || 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: (currentItem.rotation || 0) + 5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              playClick();
              setLightboxItem(currentItem);
            }}
            className="w-full bg-[#FFFDF8] text-neutral-900 rounded-lg p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-200/80 cursor-pointer group select-none relative"
          >
            {/* Sticker Icon */}
            {currentItem.sticker && (
              <div className="absolute -top-3 -right-2 text-2xl z-20 filter drop-shadow transform group-hover:scale-125 transition-transform">
                {currentItem.sticker}
              </div>
            )}

            {/* Photo frame */}
            <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-neutral-900">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Heart like badge */}
              <button
                onClick={(e) => toggleHeart(currentItem.id, e)}
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer"
                aria-label="Thả tim kỷ niệm này"
              >
                <Heart
                  size={18}
                  className={
                    likedMap[currentItem.id]
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-white/80'
                  }
                />
              </button>

              {/* Date stamp tag */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[11px] font-sans flex items-center gap-1">
                <Calendar size={12} className="text-amber-300" />
                <span>{currentItem.date}</span>
              </div>
            </div>

            {/* Polaroid handwritten caption footer */}
            <div className="pt-3 pb-1 text-center font-handwriting">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-wide">
                {currentItem.title}
              </h3>
              <p className="text-sm text-neutral-600 font-sans mt-0.5 line-clamp-1 italic">
                "{currentItem.caption}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        {memories.length > 1 && (
          <button
            onClick={prevMemory}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            aria-label="Kỷ niệm trước"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Next Button */}
        {memories.length > 1 && (
          <button
            onClick={nextMemory}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            aria-label="Kỷ niệm tiếp theo"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {memories.length > 1 && (
        <div className="flex items-center gap-2 mb-6">
          {memories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClick();
                setActiveIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-rose-soft shadow-glow-pink'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Xem ảnh ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Next Chapter Button */}
      <div className="w-full px-6 flex justify-center">
        <button
          onClick={() => {
            playClick();
            onProceed();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-rose-glow via-rose-600 to-lavender text-white shadow-glow-pink hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>TIẾP TỤC: THỬ THÁCH SINH NHẬT</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#18102C] border border-rose-400/30 rounded-2xl overflow-hidden shadow-2xl text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-[4/3] w-full bg-black">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-champagne font-semibold tracking-wider uppercase flex items-center gap-1.5">
                    <Calendar size={13} />
                    {lightboxItem.date}
                  </span>
                  <span className="text-2xl">{lightboxItem.sticker}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-warm-white">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-rose-soft font-medium mt-1">
                  "{lightboxItem.caption}"
                </p>
                <p className="text-sm text-lavender-muted mt-3 font-sans leading-relaxed border-t border-white/10 pt-3">
                  {lightboxItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
