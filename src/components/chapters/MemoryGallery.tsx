import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, X, Heart, Sparkles, 
  ArrowRight, Calendar, Eye, ZoomIn 
} from 'lucide-react';
import { BirthdayConfig, BIRTHDAY_CONFIG, MemoryItem } from '../../config/birthday.config';
import { useAudio } from '../../hooks/useAudio';
import { MistOrbBackground } from '../common/MistOrbBackground';
import { triggerBirthdayConfetti } from '../../utils/animation';

interface MemoryGalleryProps {
  config?: BirthdayConfig;
  onProceed: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ config, onProceed }) => {
  const cfg = config || BIRTHDAY_CONFIG;
  const memories = cfg.memories;
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const { playClick, playFanfare } = useAudio();

  const handleOpenPhoto = (item: MemoryItem) => {
    playClick();
    setSelectedPhoto(item);
  };

  const handleClosePhoto = () => {
    playClick();
    setSelectedPhoto(null);
  };

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    const nextState = !likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      triggerBirthdayConfetti();
    }
  };

  // Navigate while inside modal
  const currentIndex = selectedPhoto
    ? memories.findIndex((m) => m.id === selectedPhoto.id)
    : -1;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (currentIndex >= 0 && currentIndex < memories.length - 1) {
      setSelectedPhoto(memories[currentIndex + 1]);
    } else {
      setSelectedPhoto(memories[0]);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (currentIndex > 0) {
      setSelectedPhoto(memories[currentIndex - 1]);
    } else {
      setSelectedPhoto(memories[memories.length - 1]);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-4 px-2 sm:px-4 flex flex-col items-center min-h-[80vh] justify-between">
      {/* Mist Orb Animated Shader / Canvas Background (getdesign.md/backgrounds?fx=mist-orb) */}
      <MistOrbBackground className="opacity-75" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mb-6">
        {/* Superr Chapter Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2 select-none"
        >
          <Sparkles size={14} className="text-[#FBBF24]" />
          <span>Chương V • Cuốn Sổ Kỷ Niệm</span>
          <Sparkles size={14} className="text-[#FBBF24]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl sm:text-4xl font-black text-white text-glow-marker"
        >
          Kho Tàng Kỷ Niệm Của Chúng Mình
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm text-[#F7EFE9]/85 mt-1 max-w-md font-sans"
        >
          Có rất nhiều khoảnh khắc đáng nhớ ở đây. Chạm vào bất kỳ tấm ảnh nào bạn muốn mở ra xem, xem xong có thể đóng lại để chọn tấm khác nhé! ✨
        </motion.p>

        {/* Counter Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm px-3.5 py-1 rounded-full text-xs font-display font-black">
          <Eye size={13} className="text-[#FF6F1E]" />
          <span>Tổng cộng {memories.length} khoảnh khắc đáng nhớ</span>
        </div>
      </div>

      {/* INTERACTIVE POLAROID PHOTO GALLERY (Scrapbook Grid) */}
      <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-2">
        {memories.map((item, index) => {
          const rotation = item.rotation !== undefined ? item.rotation : ((index % 5) - 2) * 1.5;

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ scale: 1.05, rotate: 0, y: -6, zIndex: 20 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenPhoto(item)}
              style={{ rotate: `${rotation}deg` }}
              className="bg-[#FDFBF9] text-[#2B1A07] rounded-2xl p-2.5 sm:p-3.5 border-2.5 border-[#2B1A07] shadow-sticker hover:shadow-sticker-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between relative select-none"
            >
              {/* Washi Tape Strip on Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape -rotate-1 rounded-sm shadow-sm z-10 flex items-center justify-center">
                <span className="text-[9px] font-display font-extrabold text-[#2B1A07]/70">★ PHOTO</span>
              </div>

              {/* Sticker Emoji */}
              {item.sticker && (
                <div className="absolute -top-2 -right-2 text-2xl z-20 filter drop-shadow transform group-hover:scale-125 transition-transform rotate-6">
                  {item.sticker}
                </div>
              )}

              {/* Photo Frame */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 border-2 border-[#2B1A07] mt-1">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Heart like button */}
                <button
                  onClick={(e) => toggleHeart(item.id, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm hover:scale-115 active:scale-90 transition-all z-10 cursor-pointer"
                  aria-label="Thả tim ảnh này"
                >
                  <Heart
                    size={14}
                    className={
                      likedMap[item.id]
                        ? 'text-[#FF66CF] fill-[#FF66CF]'
                        : 'text-[#2B1A07]'
                    }
                  />
                </button>

                {/* Date Tag */}
                {item.date && (
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#FDFBF9]/95 border border-[#2B1A07] text-[#2B1A07] text-[10px] font-display font-extrabold flex items-center gap-1 shadow-sm">
                    <Calendar size={10} className="text-[#FF6F1E]" />
                    <span className="truncate max-w-[85px]">{item.date}</span>
                  </div>
                )}

                {/* Tap to view hover hint */}
                <div className="absolute inset-0 bg-[#FF6F1E]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-[#FDFBF9] text-[#2B1A07] border border-[#2B1A07] px-2.5 py-1 rounded-full text-[11px] font-display font-extrabold shadow-sticker-sm flex items-center gap-1">
                    <ZoomIn size={12} />
                    <span>Mở xem</span>
                  </div>
                </div>
              </div>

              {/* Handwritten bottom caption */}
              <div className="pt-2 pb-0.5 text-center">
                <h4 className="font-display font-black text-xs sm:text-sm text-[#2B1A07] line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#2B1A07]/75 font-handwriting line-clamp-1 mt-0.5">
                  "{item.caption}"
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next Chapter Button at bottom */}
      <div className="relative z-10 w-full px-6 flex justify-center mt-6 mb-2">
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

      {/* FULLSCREEN LIGHTBOX / FOCUSED PHOTO INSPECTOR */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePhoto}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.88, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#FDFBF9] text-[#2B1A07] border-3 border-[#2B1A07] rounded-3xl overflow-hidden shadow-sticker-lg text-left my-auto flex flex-col"
            >
              {/* Top Action Bar */}
              <div className="p-3.5 sm:p-4 bg-[#F7EFE9] border-b-2 border-[#2B1A07] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2B1A07] font-display font-black uppercase flex items-center gap-1.5 bg-[#FBBF24] px-3 py-1 rounded-full border border-[#2B1A07] shadow-sm">
                    <Calendar size={13} className="text-[#FF6F1E]" />
                    {selectedPhoto.date || 'Khoảnh khắc kỷ niệm'}
                  </span>
                  <span className="text-2xl">{selectedPhoto.sticker || '✨'}</span>
                </div>

                {/* Big Close Button: "Đóng & Chọn Ảnh Khác" */}
                <button
                  onClick={handleClosePhoto}
                  className="px-3.5 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Đóng xem ảnh này để chọn ảnh khác"
                >
                  <X size={15} />
                  <span>Đóng Lại</span>
                </button>
              </div>

              {/* Large Image Frame with Left/Right Arrows */}
              <div className="relative aspect-[4/3] w-full bg-black border-b-2.5 border-[#2B1A07] overflow-hidden group">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />

                {/* Prev Photo Arrow */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer z-10"
                  aria-label="Xem ảnh trước"
                  title="Ảnh trước"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Next Photo Arrow */}
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer z-10"
                  aria-label="Xem ảnh tiếp theo"
                  title="Ảnh tiếp"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Heart Button overlay */}
                <button
                  onClick={(e) => toggleHeart(selectedPhoto.id, e)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm text-xs font-display font-black flex items-center gap-1.5 hover:scale-105 cursor-pointer z-10"
                >
                  <Heart
                    size={16}
                    className={
                      likedMap[selectedPhoto.id]
                        ? 'text-[#FF66CF] fill-[#FF66CF]'
                        : 'text-[#2B1A07]'
                    }
                  />
                  <span>{likedMap[selectedPhoto.id] ? 'Đã yêu thích' : 'Thả tim'}</span>
                </button>
              </div>

              {/* Story & Description Content */}
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="font-display text-2xl font-black text-[#2B1A07]">
                  {selectedPhoto.title}
                </h3>

                <p className="text-lg text-[#FF6F1E] font-handwriting font-bold leading-snug">
                  "{selectedPhoto.caption}"
                </p>

                <p className="text-xs sm:text-sm text-[#2B1A07]/80 font-sans leading-relaxed border-t-2 border-[#2B1A07]/10 pt-3">
                  {selectedPhoto.description}
                </p>

                {/* Bottom Close Button to return to gallery */}
                <div className="pt-2 flex items-center justify-between border-t border-[#2B1A07]/10">
                  <span className="text-[11px] text-[#2B1A07]/60 font-sans">
                    Ảnh {currentIndex + 1} / {memories.length}
                  </span>

                  <button
                    onClick={handleClosePhoto}
                    className="superr-btn-secondary px-5 py-2 text-xs font-display font-black gap-1.5"
                  >
                    <span>Xem ảnh khác</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
