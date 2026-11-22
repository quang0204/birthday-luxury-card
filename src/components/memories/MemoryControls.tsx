import React from 'react';
import { motion } from 'framer-motion';
import { Move3d, Globe, LayoutGrid, Shuffle, Sparkles } from 'lucide-react';

interface MemoryControlsProps {
  totalCount: number;
  viewMode: 'sphere' | 'grid';
  onToggleViewMode: (mode: 'sphere' | 'grid') => void;
  onRandomMemory: () => void;
  className?: string;
}

export const MemoryControls: React.FC<MemoryControlsProps> = ({
  totalCount,
  viewMode,
  onToggleViewMode,
  onRandomMemory,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center gap-2.5 w-full select-none ${className}`}>
      {/* Top hints row: Drag to explore indicator & Counter */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Animated Drag to explore hint */}
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4F0]/8 backdrop-blur-md border border-[#FAF4F0]/20 text-[11px] font-sans font-medium text-[#FAF4F0]/85"
        >
          <Move3d size={13} className="text-[#E77C92]" />
          <span>Xoay 360° để khám phá</span>
        </motion.div>

        {/* Counter */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4F0]/8 backdrop-blur-md border border-[#FAF4F0]/20 text-[11px] font-sans font-medium text-[#FAF4F0]/85">
          <Sparkles size={12} className="text-[#E6C29C]" />
          <span>{totalCount} khoảnh khắc</span>
        </div>

        {/* Random button */}
        <button
          onClick={onRandomMemory}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4627A]/25 hover:bg-[#D4627A]/40 text-[#FEEBEF] border border-[#D4627A]/40 text-[11px] font-sans font-semibold transition-all cursor-pointer"
          title="Chọn ngẫu nhiên một khoảnh khắc"
        >
          <Shuffle size={12} />
          <span>Ngẫu Nhiên</span>
        </button>
      </div>

      {/* Mode switcher: Sphere vs Grid */}
      <div className="inline-flex items-center p-0.5 rounded-full bg-[#FAF4F0]/10 border border-[#FAF4F0]/20 backdrop-blur-md gap-0.5">
        <button
          onClick={() => onToggleViewMode('sphere')}
          className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'sphere'
              ? 'bg-[#D4627A] text-white shadow-sm'
              : 'text-[#FAF4F0]/70 hover:text-[#FAF4F0]'
          }`}
        >
          <Globe size={13} />
          <span>Quả Cầu 3D</span>
        </button>

        <button
          onClick={() => onToggleViewMode('grid')}
          className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-[#D4627A] text-white shadow-sm'
              : 'text-[#FAF4F0]/70 hover:text-[#FAF4F0]'
          }`}
        >
          <LayoutGrid size={13} />
          <span>Bộ Sưu Tập ({totalCount})</span>
        </button>
      </div>
    </div>
  );
};
