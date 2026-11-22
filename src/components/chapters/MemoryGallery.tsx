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
      {/* Superr Chapter Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2"
      >
        <Sparkles size={14} className="text-[#FBBF24]" />
        <span>Chương V • Cuốn Sổ Kỷ Niệm</span>
        <Sparkles size={14} className="text-[#FBBF24]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl sm:text-3xl font-black text-white text-glow-marker"
      >
        Những Khoảnh Khắc Đẹp Nhất
      </motion.h2>

      <p className="text-xs sm:text-sm text-[#F7EFE9]/80 mt-1 max-w-sm font-sans">
        Mỗi tấm ảnh là một kỷ niệm vô giá được dán vào cuốn sổ kỷ niệm này.
      </p>

      {/* POLAROID SCRAPBOOK DECK (Superr Tactile Paper + Washi Tape) */}
      <div className="relative w-full max-w-xs sm:max-w-sm my-6 h-[410px] flex items-center justify-center">
        {/* Washi Tape Strip on top */}
        <div className="absolute -top-3 z-30 w-28 h-8 washi-tape -rotate-2 flex items-center justify-center text-[10px] text-[#2B1A07] font-display font-extrabold shadow-sm select-none">
          MEMORIES ✨
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id || activeIndex}
            initial={{ opacity: 0, scale: 0.9, rotate: (currentItem.rotation || 0) - 5 }}
            animate={{ opacity: 1, scale: 1, rotate: currentItem.rotation || 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: (currentItem.rotation || 0) + 5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              playClick();
              setLightboxItem(currentItem);
            }}
            className="w-full bg-[#FDFBF9] text-[#2B1A07] rounded-2xl p-4 sm:p-5 border-2.5 border-[#2B1A07] shadow-sticker-lg cursor-pointer group select-none relative hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            {/* Sticker Icon */}
            {currentItem.sticker && (
              <div className="absolute -top-3 -right-3 text-3xl z-20 filter drop-shadow transform group-hover:scale-125 transition-transform rotate-6">
                {currentItem.sticker}
              </div>
            )}

            {/* Photo frame */}
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-900 border-2 border-[#2B1A07]">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Heart like badge */}
              <button
                onClick={(e) => toggleHeart(currentItem.id, e)}
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer"
                aria-label="Thả tim kỷ niệm này"
              >
                <Heart
                  size={18}
                  className={
                    likedMap[currentItem.id]
                      ? 'text-[#FF66CF] fill-[#FF66CF]'
                      : 'text-[#2B1A07]'
                  }
                />
              </button>

              {/* Date stamp tag */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#FDFBF9] border border-[#2B1A07] text-[#2B1A07] text-[11px] font-display font-extrabold flex items-center gap-1 shadow-sm">
                <Calendar size={12} className="text-[#FF6F1E]" />
                <span>{currentItem.date}</span>
              </div>
            </div>

            {/* Polaroid handwritten caption footer */}
            <div className="pt-3 pb-1 text-center">
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#2B1A07] tracking-wide">
                {currentItem.title}
              </h3>
              <p className="text-base text-[#2B1A07]/80 font-handwriting mt-0.5 line-clamp-1">
                "{currentItem.caption}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        {memories.length > 1 && (
          <button
            onClick={prevMemory}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            aria-label="Kỷ niệm trước"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Next Button */}
        {memories.length > 1 && (
          <button
            onClick={nextMemory}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            aria-label="Kỷ niệm tiếp theo"
          >
            <ChevronRight size={22} />
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
              className={`h-2.5 rounded-full transition-all duration-300 border border-[#2B1A07] cursor-pointer ${
                idx === activeIndex
                  ? 'w-7 bg-[#FF6F1E] shadow-sticker-sm'
                  : 'w-2.5 bg-white/30 hover:bg-white/50'
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
          className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2"
        >
          <span>TIẾP TỤC: THỬ THÁCH SINH NHẬT</span>
          <ArrowRight size={20} />
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
              className="relative max-w-lg w-full bg-[#FDFBF9] text-[#2B1A07] border-3 border-[#2B1A07] rounded-3xl overflow-hidden shadow-sticker-lg text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-[4/3] w-full bg-black border-b-2 border-[#2B1A07]">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#2B1A07] font-display font-black tracking-wider uppercase flex items-center gap-1.5 bg-[#FBBF24] px-3 py-1 rounded-full border border-[#2B1A07] shadow-[1px_1px_0px_#2B1A07]">
                    <Calendar size={13} />
                    {lightboxItem.date}
                  </span>
                  <span className="text-3xl">{lightboxItem.sticker}</span>
                </div>

                <h3 className="font-display text-2xl font-black text-[#2B1A07]">
                  {lightboxItem.title}
                </h3>
                <p className="text-lg text-[#FF6F1E] font-handwriting font-bold mt-1">
                  "{lightboxItem.caption}"
                </p>
                <p className="text-sm text-[#2B1A07]/80 mt-3 font-sans leading-relaxed border-t border-[#2B1A07]/15 pt-3">
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
