import React from 'react';
import { Sparkles } from 'lucide-react';

interface MemoryCounterProps {
  count: number;
  className?: string;
}

export const MemoryCounter: React.FC<MemoryCounterProps> = ({ count, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFBF9] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black text-[#2B1A07] select-none ${className}`}
    >
      <Sparkles size={13} className="text-[#FBBF24]" />
      <span>{count} khoảnh khắc vô giá</span>
    </div>
  );
};
