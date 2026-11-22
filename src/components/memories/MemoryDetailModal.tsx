import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, X, Heart, 
  Calendar, MapPin, ArrowRight 
} from 'lucide-react';
import { Memory } from '../../data/memories';

interface MemoryDetailModalProps {
  memory: Memory | null;
  currentIndex: number;
  totalCount: number;
  isLiked: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLike: (id: string) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  currentIndex,
  totalCount,
  isLiked,
  onClose,
  onNext,
  onPrev,
  onToggleLike,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  if (!memory) return null;

  // Touch swipe support (swipe left -> next, swipe right -> prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        onNext(); // swiped left
      } else {
        onPrev(); // swiped right
      }
    }
    touchStartRef.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-[#FDFBF9] text-[#2B1A07] border-3 border-[#2B1A07] rounded-3xl overflow-hidden shadow-sticker-lg text-left my-auto flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-[#F7EFE9] border-b-2 border-[#2B1A07] flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {memory.date && (
                <span className="text-xs text-[#2B1A07] font-display font-black uppercase flex items-center gap-1.5 bg-[#FBBF24] px-3 py-1 rounded-full border border-[#2B1A07] shadow-sm">
                  <Calendar size={13} className="text-[#FF6F1E]" />
                  {memory.date}
                </span>
              )}
              {memory.location && (
                <span className="text-xs text-[#2B1A07] font-display font-black flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#2B1A07] shadow-sm">
                  <MapPin size={12} className="text-[#FF66CF]" />
                  {memory.location}
                </span>
              )}
              <span className="text-xl">{memory.sticker || '✨'}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Đóng để tiếp tục xoay quả cầu"
            >
              <X size={15} />
              <span>Đóng Lại</span>
            </button>
          </div>

          {/* Large Image Frame with Navigation Arrows */}
          <div className="relative aspect-[4/3] w-full bg-black border-b-2.5 border-[#2B1A07] overflow-hidden group">
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover"
            />

            {/* Prev Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer z-10"
              aria-label="Xem kỷ niệm trước"
              title="Kỷ niệm trước"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer z-10"
              aria-label="Xem kỷ niệm tiếp theo"
              title="Kỷ niệm tiếp"
            >
              <ChevronRight size={22} />
            </button>

            {/* Heart Button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(memory.id);
              }}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] text-[#2B1A07] shadow-sticker-sm text-xs font-display font-black flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer z-10"
            >
              <Heart
                size={16}
                className={
                  isLiked
                    ? 'text-[#FF66CF] fill-[#FF66CF]'
                    : 'text-[#2B1A07]'
                }
              />
              <span>{isLiked ? 'Đã yêu thích' : 'Thả tim'}</span>
            </button>
          </div>

          {/* Story & Description Content */}
          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="font-display text-2xl font-black text-[#2B1A07]">
              {memory.title}
            </h3>

            <p className="text-lg text-[#FF6F1E] font-handwriting font-bold leading-snug">
              "{memory.caption}"
            </p>

            {memory.description && (
              <p className="text-xs sm:text-sm text-[#2B1A07]/80 font-sans leading-relaxed border-t-2 border-[#2B1A07]/10 pt-3">
                {memory.description}
              </p>
            )}

            {/* Bottom Footer Action */}
            <div className="pt-2 flex items-center justify-between border-t border-[#2B1A07]/10">
              <span className="text-[11px] text-[#2B1A07]/60 font-sans">
                Kỷ niệm {currentIndex >= 0 ? currentIndex + 1 : 1} / {totalCount}
              </span>

              <button
                onClick={onClose}
                className="superr-btn-secondary px-5 py-2 text-xs font-display font-black gap-1.5"
              >
                <span>Quay lại quả cầu ảnh</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
