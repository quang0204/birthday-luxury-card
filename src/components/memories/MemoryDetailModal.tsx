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
        className="fixed inset-0 z-50 bg-[#12060C]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.94, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-[#FCFAF7] text-[#2D1117] border border-[#2D1117]/15 rounded-2xl overflow-hidden shadow-2xl text-left my-auto flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 bg-[#F8F4EE] border-b border-[#2D1117]/10 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {memory.date && (
                <span className="text-[11px] text-[#2D1117] font-sans font-semibold uppercase tracking-wider flex items-center gap-1 bg-[#FAF4F0] px-2.5 py-0.5 rounded-full border border-[#2D1117]/12">
                  <Calendar size={11} className="text-[#D4627A]" />
                  {memory.date}
                </span>
              )}
              {memory.location && (
                <span className="text-[11px] text-[#2D1117]/70 font-sans font-light flex items-center gap-1 bg-[#FAF4F0] px-2.5 py-0.5 rounded-full border border-[#2D1117]/12">
                  <MapPin size={11} className="text-[#D4627A]" />
                  {memory.location}
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#2D1117]/5 hover:bg-[#2D1117]/10 text-[#2D1117] flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng để quay lại quả cầu"
            >
              <X size={15} />
            </button>
          </div>

          {/* Large Image Frame with Navigation Arrows */}
          <div className="relative aspect-[4/3] w-full bg-[#180A12] border-b border-[#2D1117]/10 overflow-hidden group">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FCFAF7]/90 text-[#2D1117] border border-[#2D1117]/15 backdrop-blur-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
              aria-label="Xem kỷ niệm trước"
              title="Kỷ niệm trước"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FCFAF7]/90 text-[#2D1117] border border-[#2D1117]/15 backdrop-blur-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
              aria-label="Xem kỷ niệm tiếp theo"
              title="Kỷ niệm tiếp"
            >
              <ChevronRight size={20} />
            </button>

            {/* Heart Button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(memory.id);
              }}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#FCFAF7]/90 backdrop-blur-md border border-[#2D1117]/15 text-[#2D1117] text-xs font-sans font-semibold flex items-center gap-1.5 hover:bg-white transition-all cursor-pointer z-10"
            >
              <Heart
                size={14}
                className={
                  isLiked
                    ? 'text-[#D4627A] fill-[#D4627A]'
                    : 'text-[#2D1117]'
                }
              />
              <span>{isLiked ? 'Đã yêu thích' : 'Thả tim'}</span>
            </button>
          </div>

          {/* Story & Description Content */}
          <div className="p-5 sm:p-6 space-y-2.5">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D1117] tracking-tight">
              {memory.title}
            </h3>

            <p className="font-serif italic text-base sm:text-lg text-[#D4627A] leading-snug">
              "{memory.caption}"
            </p>

            {memory.description && (
              <p className="text-xs sm:text-sm text-[#2D1117]/75 font-sans font-light leading-relaxed border-t border-[#2D1117]/10 pt-3">
                {memory.description}
              </p>
            )}

            {/* Bottom Footer Action */}
            <div className="pt-2 flex items-center justify-between border-t border-[#2D1117]/10">
              <span className="text-[11px] text-[#2D1117]/55 font-serif italic tracking-wider">
                Khoảnh khắc {currentIndex >= 0 ? currentIndex + 1 : 1} / {totalCount}
              </span>

              <button
                onClick={onClose}
                className="btn-editorial-secondary px-4 py-1.5 text-xs font-sans font-semibold gap-1.5"
              >
                <span>Quay lại quả cầu ảnh</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
