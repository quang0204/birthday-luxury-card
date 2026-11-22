import React from 'react';
import { Shuffle } from 'lucide-react';

interface RandomMemoryButtonProps {
  onRandom: () => void;
  className?: string;
}

export const RandomMemoryButton: React.FC<RandomMemoryButtonProps> = ({
  onRandom,
  className = '',
}) => {
  return (
    <button
      onClick={onRandom}
      className={`px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm text-xs font-display font-black flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer ${className}`}
      title="Mở ngẫu nhiên một kỷ niệm bất ngờ"
    >
      <Shuffle size={13} className="text-[#FF6F1E]" />
      <span>Ngẫu Nhiên</span>
    </button>
  );
};
