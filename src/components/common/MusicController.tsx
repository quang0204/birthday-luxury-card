import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Sliders } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { soundEngine } from '../../utils/audio';

export const MusicController: React.FC = () => {
  const { isMuted, isPlaying, toggleMute } = useAudio();
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolumeState] = useState(0.6);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolumeState(val);
    soundEngine.setVolume(val);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Volume slider drawer */}
      {showVolume && (
        <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 animate-fadeIn shadow-lg">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Điều chỉnh âm lượng"
            className="w-16 sm:w-20 accent-rose-accent h-1.5 bg-white/20 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Volume toggle button */}
      <button
        onClick={() => setShowVolume(!showVolume)}
        className="glass-panel w-9 h-9 rounded-full hidden sm:flex items-center justify-center text-warm-white/70 hover:text-white transition-colors"
        aria-label="Cài đặt âm lượng"
        title="Âm lượng"
      >
        <Sliders size={14} />
      </button>

      {/* Main Music Pill Button */}
      <button
        onClick={toggleMute}
        className={`glass-panel px-3.5 py-2 rounded-full flex items-center gap-2.5 transition-all duration-300 shadow-glass ${
          !isMuted 
            ? 'border-rose-soft/40 shadow-glow-pink/30 text-rose-soft' 
            : 'border-white/10 text-white/50 hover:text-white/80'
        }`}
        aria-label={isMuted ? 'Bật âm nhạc' : 'Tắt âm nhạc'}
      >
        <div className="relative flex items-center justify-center">
          {!isMuted ? (
            <Music size={16} className={`transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`} />
          ) : (
            <VolumeX size={16} />
          )}
        </div>

        {/* Dancing audio visualizer bars when playing */}
        {!isMuted && (
          <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
            <span className="w-0.5 bg-rose-soft rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2"></span>
            <span className="w-0.5 bg-lavender-light rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s] h-3.5"></span>
            <span className="w-0.5 bg-champagne rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-2.5"></span>
          </div>
        )}

        <span className="text-xs font-medium tracking-wide">
          {isMuted ? 'Muted' : 'Music On'}
        </span>
      </button>
    </div>
  );
};
