import React from 'react';
import { Layers, LayoutGrid } from 'lucide-react';

interface MemoryControlsProps {
  totalCount: number;
  viewMode: 'sphere' | 'grid';
  onToggleViewMode: (mode: 'sphere' | 'grid') => void;
  onRandomMemory?: () => void;
  className?: string;
}

export const MemoryControls: React.FC<MemoryControlsProps> = ({
  totalCount,
  viewMode,
  onToggleViewMode,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 w-full select-none ${className}`}>
      {/* Mode switcher: Coverflow vs Grid */}
      <div className="inline-flex items-center p-0.5 rounded-full bg-[#FAF4F0]/10 border border-[#FAF4F0]/20 backdrop-blur-md gap-0.5">
        <button
          onClick={() => onToggleViewMode('sphere')}
          className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'sphere'
              ? 'bg-[#D4627A] text-white shadow-sm'
              : 'text-[#FAF4F0]/70 hover:text-[#FAF4F0]'
          }`}
        >
          <Layers size={13} />
          <span>Coverflow 3D</span>
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
          <span>Lưới Ảnh ({totalCount})</span>
        </button>
      </div>
    </div>
  );
};
