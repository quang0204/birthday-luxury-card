import React from 'react';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { MusicController } from '../components/common/MusicController';
import { ChapterNumber } from '../hooks/useBirthdayExperience';
import { Sparkles, QrCode, PenTool, Layers } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday.config';

interface BirthdayLayoutProps {
  currentChapter: ChapterNumber;
  config: BirthdayConfig;
  isRecipientMode?: boolean;
  onSelectChapter: (chapter: ChapterNumber) => void;
  onOpenQR: () => void;
  onOpenCreator: () => void;
  onOpenDashboard?: () => void;
  children: React.ReactNode;
}

export const BirthdayLayout: React.FC<BirthdayLayoutProps> = ({
  currentChapter,
  config,
  isRecipientMode = false,
  onSelectChapter,
  onOpenQR,
  onOpenCreator,
  onOpenDashboard,
  children,
}) => {
  const chapterTitles = [
    'Lời Mời',
    'Hộp Quà',
    'Đại Tiệc',
    'Ước Nguyện',
    'Kỷ Niệm',
    'Thử Thách',
    'Bức Thư',
    'Bất Ngờ',
  ];

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#12060C] text-[#FAF4F0] flex flex-col justify-between selection:bg-[#D4627A]/30 selection:text-white film-grain">
      {/* Editorial Ambient Rose & Warm Blush Atmosphere */}
      <div className="fixed top-0 left-1/3 w-[550px] h-[550px] bg-[#D4627A]/9 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E6C29C]/7 rounded-full blur-[170px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#541525]/25 rounded-full blur-[200px] pointer-events-none" />

      {/* Floating Starlight Particle Background */}
      <ParticleBackground />

      {/* Floating Music Controller */}
      <MusicController />

      {/* Top Editorial Header */}
      <header className="safe-top relative z-30 pt-5 px-4 sm:px-8 flex items-center justify-between max-w-5xl mx-auto w-full gap-4">
        {/* Monogram & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#FAF4F0]/25 bg-[#FAF4F0]/5 backdrop-blur-md flex items-center justify-center shrink-0">
            <span className="font-serif italic font-bold text-sm text-[#E77C92]">
              {config.recipientName ? config.recipientName.charAt(0) : 'B'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-[0.2em] text-[11px] sm:text-xs font-semibold text-[#FAF4F0]/90 uppercase block">
                The Birthday Experience
              </span>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#E77C92] uppercase border-l border-[#FAF4F0]/20 pl-2">
                Vol. 20
              </span>
            </div>
            <p className="text-[11px] text-[#FAF4F0]/60 font-sans tracking-wide">
              Dành riêng cho <span className="text-[#FAF4F0] font-semibold">{config.recipientName}</span>
            </p>
          </div>
        </div>

        {/* Creator Studio & QR Controls (Hidden in Recipient Mode) */}
        {!isRecipientMode && (
          <div className="flex items-center gap-2">
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="btn-glass-interactive px-3.5 py-1.5 text-xs tracking-wide flex items-center gap-1.5"
                title="Quản lý tất cả các thiệp sinh nhật"
              >
                <Layers size={12} className="text-[#E77C92]" />
                <span className="hidden sm:inline">Kho Thiệp</span>
              </button>
            )}

            <button
              onClick={onOpenCreator}
              className="btn-glass-interactive px-3.5 py-1.5 text-xs tracking-wide flex items-center gap-1.5"
              title="Tự tạo hoặc chỉnh sửa thiệp này"
            >
              <PenTool size={12} className="text-[#E77C92]" />
              <span className="hidden sm:inline">Chỉnh Sửa</span>
            </button>

            <button
              onClick={onOpenQR}
              className="btn-glass-interactive px-3.5 py-1.5 text-xs tracking-wide flex items-center gap-1.5 bg-[#D4627A]/20 hover:bg-[#D4627A]/35 border-[#D4627A]/40 text-[#FEEBEF]"
              title="Mở mã QR & thiệp in"
            >
              <QrCode size={12} className="text-[#FAF4F0]" />
              <span>Mã QR</span>
            </button>
          </div>
        )}
      </header>

      {/* Editorial Chapter Navigation Bar */}
      <div className="relative z-30 flex flex-col items-center justify-center pt-3 pb-1 gap-1">
        {/* Folio Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {romanNumerals.map((roman, idx) => {
            const num = idx + 1;
            const isCurrent = num === currentChapter;
            const isPassed = num < currentChapter;

            return (
              <button
                key={num}
                onClick={() => onSelectChapter(num as ChapterNumber)}
                className={`transition-all duration-300 font-serif text-[11px] sm:text-xs tracking-wider cursor-pointer py-1 px-1.5 rounded ${
                  isCurrent
                    ? 'text-[#FEEBEF] font-bold border-b-2 border-[#D4627A] scale-110'
                    : isPassed
                    ? 'text-[#FAF4F0]/65 hover:text-[#FAF4F0]'
                    : 'text-[#FAF4F0]/30 hover:text-[#FAF4F0]/60'
                }`}
                title={`Chương ${roman}: ${chapterTitles[idx]}`}
              >
                {roman}
              </button>
            );
          })}
        </div>

        {/* Current Chapter Subtitle */}
        <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#E77C92]">
          Chương {romanNumerals[currentChapter - 1]} — {chapterTitles[currentChapter - 1]}
        </span>
      </div>

      {/* Main Stage Content */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-20 w-full max-w-4xl mx-auto py-3 px-3 sm:px-6">
        {children}
      </main>

      {/* Editorial Colophon / Footer */}
      <footer className="safe-bottom relative z-20 py-4 px-4 text-center text-[11px] text-[#FAF4F0]/50 font-sans tracking-wide flex flex-col items-center gap-1 border-t border-[#FAF4F0]/8">
        {!isRecipientMode ? (
          <div>
            Bạn muốn tạo một thiệp sinh nhật tinh tế cho người thân?{' '}
            <button
              onClick={onOpenCreator}
              className="text-[#E77C92] hover:text-[#FEEBEF] transition-colors font-medium underline underline-offset-4 ml-1 cursor-pointer"
            >
              Mở xưởng tạo thiệp riêng
            </button>
          </div>
        ) : (
          <div className="italic font-serif text-xs text-[#FAF4F0]/70">
            A bespoke birthday publication, crafted with love for{' '}
            <span className="not-italic font-sans font-semibold text-[#FAF4F0]">
              {config.recipientName}
            </span>
          </div>
        )}
      </footer>
    </div>
  );
};
