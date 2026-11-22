import React from 'react';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { MusicController } from '../components/common/MusicController';
import { ChapterNumber } from '../hooks/useBirthdayExperience';
import { Sparkles, QrCode } from 'lucide-react';

interface BirthdayLayoutProps {
  currentChapter: ChapterNumber;
  onSelectChapter: (chapter: ChapterNumber) => void;
  onOpenQR: () => void;
  children: React.ReactNode;
}

export const BirthdayLayout: React.FC<BirthdayLayoutProps> = ({
  currentChapter,
  onSelectChapter,
  onOpenQR,
  children
}) => {
  const chapterTitles = [
    'Lời Mời',
    'Hộp Quà',
    'Đại Tiệc',
    'Ước Nguyện',
    'Kỷ Niệm',
    'Thử Thách',
    'Bức Thư',
    'Bất Ngờ'
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-[#07040F] via-[#0E091E] to-[#150D2D] text-warm-white flex flex-col justify-between selection:bg-rose-accent/30 selection:text-white">
      {/* Dynamic ambient soft color orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating 60fps Star Particle System */}
      <ParticleBackground />

      {/* Music Controller floating pill */}
      <MusicController />

      {/* Top Header / Progress Pill */}
      <header className="safe-top relative z-30 pt-4 px-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        {/* Brand/Event Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 flex items-center justify-center shadow-glow-pink">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xs sm:text-sm tracking-wider text-rose-soft uppercase block">
              The Birthday Experience
            </span>
            <span className="text-[10px] text-lavender-muted block font-sans">
              Chương {currentChapter}/8: {chapterTitles[currentChapter - 1]}
            </span>
          </div>
        </div>

        {/* QR Code quick trigger */}
        <button
          onClick={onOpenQR}
          className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-champagne hover:text-white transition-all border border-amber-300/30 shadow-sm"
          title="Mở mã QR & thiệp in"
        >
          <QrCode size={14} />
          <span className="hidden sm:inline">Mã QR</span>
        </button>
      </header>

      {/* Chapter Stepper Dots */}
      <div className="relative z-30 flex items-center justify-center gap-1.5 sm:gap-2 pt-3 pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
          const isCurrent = num === currentChapter;
          const isPassed = num < currentChapter;

          return (
            <button
              key={num}
              onClick={() => onSelectChapter(num as ChapterNumber)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-7 bg-rose-soft shadow-glow-pink'
                  : isPassed
                  ? 'w-2 bg-purple-400/60'
                  : 'w-1.5 bg-white/20'
              }`}
              title={`Chuyển đến chương ${num}: ${chapterTitles[num - 1]}`}
              aria-label={`Chương ${num}`}
            />
          );
        })}
      </div>

      {/* Main Chapter Content Container */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-20 w-full max-w-4xl mx-auto py-4">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="safe-bottom relative z-20 py-4 px-4 text-center text-[11px] text-white/30 font-sans">
        Crafted with love for your unforgettable birthday ✨
      </footer>
    </div>
  );
};
