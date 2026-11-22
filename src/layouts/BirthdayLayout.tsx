import React from 'react';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { MusicController } from '../components/common/MusicController';
import { ChapterNumber } from '../hooks/useBirthdayExperience';
import { Sparkles, QrCode, PenTool } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday.config';

interface BirthdayLayoutProps {
  currentChapter: ChapterNumber;
  config: BirthdayConfig;
  isRecipientMode?: boolean;
  onSelectChapter: (chapter: ChapterNumber) => void;
  onOpenQR: () => void;
  onOpenCreator: () => void;
  children: React.ReactNode;
}

export const BirthdayLayout: React.FC<BirthdayLayoutProps> = ({
  currentChapter,
  config,
  isRecipientMode = false,
  onSelectChapter,
  onOpenQR,
  onOpenCreator,
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

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-[#130B1C] via-[#1A0E26] to-[#201030] text-[#FDFBF9] flex flex-col justify-between selection:bg-[#FF6F1E]/30 selection:text-white">
      {/* Warm Golden Hour & Marker Orange ambient light blooms */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#FF6F1E]/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-[#FF66CF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#FBBF24]/6 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating 60fps Star Particle System */}
      <ParticleBackground />

      {/* Music Controller floating pill */}
      <MusicController />

      {/* Top Header */}
      <header className="safe-top relative z-30 pt-4 px-4 flex items-center justify-between max-w-4xl mx-auto w-full gap-2">
        {/* Superr Brand & Recipient Sticker */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FF6F1E] border-2 border-[#2B1A07] shadow-sticker-sm flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs sm:text-sm tracking-wide text-white uppercase block">
                The Birthday Experience
              </span>
              <span className="text-[10px] bg-[#FF66CF] text-[#2B1A07] font-display font-black px-1.5 py-0.2 rounded-md border border-[#2B1A07] shadow-[1px_1px_0px_#2B1A07]">
                Superr
              </span>
            </div>
            <span className="text-[11px] text-[#F7EFE9]/80 block font-sans">
              Chương {currentChapter}/8: {chapterTitles[currentChapter - 1]} • Dành cho <strong className="text-[#FBBF24]">{config.recipientName}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons: Only show for the creator, NEVER for the recipient */}
        {!isRecipientMode && (
          <div className="flex items-center gap-2">
            {/* Create Card Studio Button */}
            <button
              onClick={onOpenCreator}
              className="px-3.5 py-1.5 rounded-full text-xs font-display font-extrabold flex items-center gap-1.5 bg-[#FF6F1E] text-white border-2 border-[#2B1A07] shadow-sticker-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-sticker active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2B1A07] transition-all cursor-pointer"
              title="Tự tạo hoặc chỉnh sửa thiệp này"
            >
              <PenTool size={13} />
              <span>Tạo Thiệp</span>
            </button>

            {/* QR Code trigger */}
            <button
              onClick={onOpenQR}
              className="px-3 py-1.5 rounded-full text-xs font-display font-extrabold flex items-center gap-1.5 bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-sticker active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2B1A07] transition-all cursor-pointer"
              title="Mở mã QR & thiệp in"
            >
              <QrCode size={13} />
              <span className="hidden sm:inline">Mã QR</span>
            </button>
          </div>
        )}
      </header>

      {/* Chapter Stepper Dots */}
      <div className="relative z-30 flex items-center justify-center gap-2 pt-3 pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
          const isCurrent = num === currentChapter;
          const isPassed = num < currentChapter;

          return (
            <button
              key={num}
              onClick={() => onSelectChapter(num as ChapterNumber)}
              className={`h-2.5 rounded-full transition-all duration-300 border border-[#2B1A07] cursor-pointer ${
                isCurrent
                  ? 'w-8 bg-[#FF6F1E] shadow-sticker-sm'
                  : isPassed
                  ? 'w-3 bg-[#FF66CF]'
                  : 'w-2 bg-[#FDFBF9]/30'
              }`}
              title={`Chương ${num}: ${chapterTitles[num - 1]}`}
              aria-label={`Chương ${num}`}
            />
          );
        })}
      </div>

      {/* Main Chapter Content Container */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-20 w-full max-w-4xl mx-auto py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="safe-bottom relative z-20 py-4 px-4 text-center text-xs text-[#F7EFE9]/50 font-sans flex flex-col items-center gap-1">
        {!isRecipientMode ? (
          <div>
            Bạn muốn tạo một thiệp sinh nhật tuyệt đẹp cho người thân?{' '}
            <button
              onClick={onOpenCreator}
              className="text-[#FF6F1E] hover:underline font-bold cursor-pointer ml-1"
            >
              Bấm vào đây để tự tạo thiệp miễn phí ✨
            </button>
          </div>
        ) : (
          <div>
            Món quà kỷ niệm được chuẩn bị với trọn yêu thương dành cho{' '}
            <span className="text-[#FBBF24] font-bold">{config.recipientName}</span> ❤️
          </div>
        )}
      </footer>
    </div>
  );
};
