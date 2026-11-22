import React from 'react';
import { motion } from 'framer-motion';
import { Move3d, Globe, LayoutGrid } from 'lucide-react';
import { MemoryCounter } from './MemoryCounter';
import { RandomMemoryButton } from './RandomMemoryButton';

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
          animate={{ x: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1259]/80 backdrop-blur-md border border-[#F472B6]/40 text-[11px] font-display font-bold text-[#FDFBF9] shadow-sm"
        >
          <Move3d size={13} className="text-[#FF66CF]" />
          <span>Kéo / Vuốt để xoay 360°</span>
        </motion.div>

        <MemoryCounter count={totalCount} />

        <RandomMemoryButton onRandom={onRandomMemory} />
      </div>

      {/* Mode switcher: Sphere vs Grid */}
      <div className="inline-flex items-center p-1 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] shadow-sticker-sm gap-1">
        <button
          onClick={() => onToggleViewMode('sphere')}
          className={`px-3 py-1 rounded-full text-xs font-display font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'sphere'
              ? 'bg-[#FF6F1E] text-white shadow-sm'
              : 'text-[#2B1A07] hover:bg-neutral-100'
          }`}
        >
          <Globe size={13} />
          <span>Quả Cầu 3D Mist Orb</span>
        </button>

        <button
          onClick={() => onToggleViewMode('grid')}
          className={`px-3 py-1 rounded-full text-xs font-display font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-[#FF6F1E] text-white shadow-sm'
              : 'text-[#2B1A07] hover:bg-neutral-100'
          }`}
        >
          <LayoutGrid size={13} />
          <span>Album Lưới ({totalCount})</span>
        </button>
      </div>
    </div>
  );
};
