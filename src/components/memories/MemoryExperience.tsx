import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { Memory } from '../../data/memories';
import { MemoryItem } from '../../config/birthday.config';
import { useMemorySphere } from '../../hooks/useMemorySphere';
import { MemorySphere } from './MemorySphere';
import { MemoryControls } from './MemoryControls';
import { MemoryDetailModal } from './MemoryDetailModal';

export interface MemoryExperienceProps {
  memories?: (Memory | MemoryItem)[];
  onProceed: () => void;
  playClick?: () => void;
}

export const MemoryExperience: React.FC<MemoryExperienceProps> = ({
  memories: inputMemories,
  onProceed,
  playClick,
}) => {
  const {
    memories,
    viewMode,
    setViewMode,
    selectedMemory,
    selectedIndex,
    hoveredId,
    setHoveredId,
    likedMap,
    openDetail,
    closeDetail,
    nextMemory,
    prevMemory,
    randomMemory,
    toggleLike,
  } = useMemorySphere(inputMemories, playClick);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2 px-2 sm:px-4 flex flex-col items-center min-h-[82vh] justify-between">
      {/* 1. Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mb-1">
        {/* Superr Chapter Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF66CF] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black mb-2 select-none"
        >
          <Sparkles size={14} className="text-[#FBBF24]" />
          <span>CHƯƠNG V • VŨ TRỤ KÝ ỨC</span>
          <Sparkles size={14} className="text-[#FBBF24]" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl sm:text-4xl font-black text-white text-glow-marker tracking-wide"
        >
          OUR MEMORIES
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-handwriting text-lg sm:text-xl text-[#FF66CF] font-bold mt-0.5"
        >
          "Some moments deserve to live forever."
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xs sm:text-sm text-[#F7EFE9]/85 mt-1 max-w-md font-sans"
        >
          Mỗi bức ảnh là một câu chuyện. Hãy xoay quả cầu và tìm lại những khoảnh khắc đáng nhớ nhé.
        </motion.p>

        {/* Controls: Drag hint, Counter, Random Memory, View Switcher */}
        <div className="mt-3 w-full flex justify-center">
          <MemoryControls
            totalCount={memories.length}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            onRandomMemory={randomMemory}
          />
        </div>
      </div>

      {/* 2. Main Gallery: 3D Mist Orb Photo Sphere OR Flat Scrapbook Grid */}
      {viewMode === 'sphere' ? (
        <div className="relative z-10 w-full flex items-center justify-center my-1">
          <MemorySphere
            memories={memories}
            selectedMemory={selectedMemory}
            onSelectMemory={openDetail}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        </div>
      ) : (
        /* Alternative 2D Scrapbook Grid */
        <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-4">
          {memories.map((item, index) => {
            const rotation = item.rotation !== undefined ? item.rotation : ((index % 5) - 2) * 1.5;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ scale: 1.05, rotate: 0, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openDetail(item)}
                style={{ rotate: `${rotation}deg` }}
                className="bg-[#FDFBF9] text-[#2B1A07] rounded-2xl p-2.5 sm:p-3.5 border-2.5 border-[#2B1A07] shadow-sticker hover:shadow-sticker-lg transition-all cursor-pointer group flex flex-col justify-between relative select-none"
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
                  {item.date && (
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#FDFBF9]/95 border border-[#2B1A07] text-[#2B1A07] text-[10px] font-display font-extrabold flex items-center gap-1 shadow-sm">
                      <Calendar size={10} className="text-[#FF6F1E]" />
                      <span className="truncate max-w-[85px]">{item.date}</span>
                    </div>
                  )}
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
      )}

      {/* 3. Bottom Next Chapter Button */}
      <div className="relative z-10 w-full px-6 flex justify-center mt-3 mb-2">
        <button
          onClick={() => {
            if (playClick) playClick();
            onProceed();
          }}
          className="superr-btn-primary w-full sm:w-auto px-9 py-4 text-base gap-2"
        >
          <span>TIẾP TỤC: THỬ THÁCH SINH NHẬT</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* 4. Cinematic Lightbox / Memory Detail Modal */}
      <MemoryDetailModal
        memory={selectedMemory}
        currentIndex={selectedIndex}
        totalCount={memories.length}
        isLiked={selectedMemory ? !!likedMap[selectedMemory.id] : false}
        onClose={closeDetail}
        onNext={nextMemory}
        onPrev={prevMemory}
        onToggleLike={toggleLike}
      />
    </div>
  );
};
