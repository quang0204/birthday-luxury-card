import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Memory } from '../../data/memories';
import { MemoryItem } from '../../config/birthday.config';
import { useMemorySphere } from '../../hooks/useMemorySphere';
import CoverflowCarousel, { CoverflowSlide } from '../ui/coverflow-carousel';
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

  const slides: CoverflowSlide[] = useMemo(() => {
    return memories.map((item) => ({
      src: item.image,
      alt: item.title,
      title: item.title,
      subtitle: item.caption,
      meta: [
        ...(item.date ? [{ label: 'Thời gian', value: item.date }] : []),
        ...(item.location ? [{ label: 'Địa điểm', value: item.location }] : []),
      ],
    }));
  }, [memories]);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2 px-2 sm:px-4 flex flex-col items-center min-h-[82vh] justify-between">
      {/* 1. Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mb-1">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#FAF4F0]"
        >
          OUR MEMORIES
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-serif italic text-base sm:text-lg text-[#E77C92] font-normal mt-1"
        >
          "Some moments deserve to live forever."
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#FAF4F0]/65 mt-1.5 max-w-md font-sans font-light leading-relaxed"
        >
          Mỗi bức ảnh là một câu chuyện. Hãy lật giở từng trang kỷ niệm 3D Coverflow để tìm lại những khoảnh khắc đáng nhớ nhé.
        </motion.p>

        {/* Controls: Drag hint, Counter, Random Memory, View Switcher */}
        <div className="mt-3.5 w-full flex justify-center">
          <MemoryControls
            totalCount={memories.length}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            onRandomMemory={randomMemory}
          />
        </div>
      </div>

      {/* 2. Main Gallery: 3D Coverflow Carousel OR Flat Scrapbook Grid */}
      {memories.length === 0 ? (
        <div className="relative z-10 w-full max-w-md mx-auto my-12 p-8 rounded-3xl bg-white/[0.04] border border-white/10 text-center flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-[#D4627A]/15 border border-[#D4627A]/30 flex items-center justify-center text-[#E77C92]">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#FCFAF7] mb-1">Chưa Có Ảnh Kỷ Niệm</h3>
            <p className="text-xs text-[#FCFAF7]/60 leading-relaxed font-sans font-light">
              Album ảnh kỷ niệm hiện đang trống. Bạn có thể bấm nút <strong>Chỉnh Sửa</strong> ở góc trên để thêm những bức ảnh kỷ niệm tuyệt đẹp của hai bạn nhé!
            </p>
          </div>
        </div>
      ) : viewMode === 'sphere' ? (
        <div className="relative z-10 w-full flex flex-col items-center justify-center my-1 max-w-3xl">
          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(200px, 30vw, 290px)"
            rotate={42}
            depth={0.65}
            gap={0.06}
            showNavigation={true}
            showPagination={true}
            showCaption={true}
            cardClassName="border border-white/25 shadow-2xl hover:border-[#E77C92]/70 transition-all duration-300"
            onCardClick={(index) => {
              if (memories[index]) {
                openDetail(memories[index]);
              }
            }}
          />
          <p className="text-[11px] text-white/50 font-sans tracking-wide mt-3 text-center">
            ✨ Vuốt hoặc dùng phím mũi tên ← → để lật ảnh • Bấm vào ảnh trung tâm để phóng to chi tiết
          </p>
        </div>
      ) : (
        /* Alternative 2D Editorial Photo Grid */
        <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-4">
          {memories.map((item, index) => {
            const rotation = item.rotation !== undefined ? item.rotation : ((index % 5) - 2) * 1.2;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openDetail(item)}
                style={{ rotate: `${rotation}deg` }}
                className="bg-[#FCFAF7] text-[#2D1117] rounded-xl p-3 border border-[#2D1117]/15 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative select-none"
              >
                {/* Photo Frame */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 border border-[#2D1117]/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.date && (
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-[#FCFAF7]/95 border border-[#2D1117]/15 text-[#2D1117] text-[10px] font-sans font-semibold flex items-center gap-1 shadow-sm">
                      <Calendar size={10} className="text-[#D4627A]" />
                      <span className="truncate max-w-[85px]">{item.date}</span>
                    </div>
                  )}
                </div>

                {/* Editorial bottom caption */}
                <div className="pt-2.5 pb-0.5 text-center">
                  <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#2D1117] line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#D4627A] font-serif italic line-clamp-1 mt-0.5">
                    "{item.caption}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 3. Bottom Next Chapter Button: Sticky on mobile, standard on desktop */}
      <div className="fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto z-40 sm:z-10 w-full px-4 py-3 sm:py-0 bg-[#12060C]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-white/10 sm:border-none flex justify-center mt-3 mb-2 shadow-2xl sm:shadow-none">
        <button
          onClick={() => {
            if (playClick) playClick();
            onProceed();
          }}
          className="btn-editorial-primary px-8 py-3.5 sm:px-9 sm:py-4 tracking-[0.14em] text-xs uppercase gap-2 w-full sm:w-auto shadow-lg"
        >
          <span>TIẾP TỤC: THỬ THÁCH SINH NHẬT</span>
          <ArrowRight size={15} />
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
