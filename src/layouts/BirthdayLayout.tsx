import React, { useState, useEffect } from 'react';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { MusicController } from '../components/common/MusicController';
import HalftoneNebula, { NEBULA_PRESETS } from '../components/ui/halftone-nebula';
import ChapterRailNav from '../components/ui/chapter-rail-nav';
import { ChapterNumber } from '../hooks/useBirthdayExperience';
import { Sparkles, QrCode, PenTool, Layers } from 'lucide-react';
import { BirthdayConfig } from '../config/birthday.config';

export type BackgroundThemeType = 'crimson' | 'ultraviolet' | 'solar' | 'abyssal' | 'phosphor' | 'particles';

const THEME_OPTIONS: Array<{ id: BackgroundThemeType; label: string; icon: string }> = [
  { id: 'crimson', label: 'Crimson Rose', icon: '🌌' },
  { id: 'ultraviolet', label: 'Tím Mộng Mơ', icon: '🔮' },
  { id: 'solar', label: 'Hoàng Kim', icon: '☀️' },
  { id: 'abyssal', label: 'Lam Ngọc', icon: '🌊' },
  { id: 'phosphor', label: 'Lục Bảo', icon: '🌿' },
  { id: 'particles', label: 'Sao Rơi', icon: '✨' },
];

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

  // Background Theme: Halftone Nebula presets or Classic Particles
  const [bgTheme, setBgTheme] = useState<BackgroundThemeType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('birthday_bg_theme');
      if (saved && ['crimson', 'ultraviolet', 'solar', 'abyssal', 'phosphor', 'particles'].includes(saved)) {
        return saved as BackgroundThemeType;
      }
    }
    return 'crimson';
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSelectTheme = (theme: BackgroundThemeType) => {
    setBgTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('birthday_bg_theme', theme);
    }
    setShowThemePicker(false);
  };

  // Prevent spoilers in recipient mode: keep track of the furthest unlocked chapter
  const [maxUnlockedChapter, setMaxUnlockedChapter] = React.useState<number>(currentChapter);
  React.useEffect(() => {
    setMaxUnlockedChapter((prev) => Math.max(prev, currentChapter));
  }, [currentChapter]);

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${bgTheme === 'particles' ? 'bg-[#12060C]' : 'bg-[#050309]'} text-[#FAF4F0] flex flex-col justify-between selection:bg-[#D4627A]/30 selection:text-white film-grain`}>
      {/* Halftone Nebula Living Pixel-Art Cosmic Canvas */}
      {bgTheme !== 'particles' ? (
        <div className="fixed inset-0 pointer-events-none z-0">
          <HalftoneNebula
            height="100vh"
            preset={bgTheme}
            params={{
              // Tuned for warm luxury aesthetic
              density: 0.48,
              grain: 0.02,
              pixel: 6,
              sparkles: 8,
              planet: true,
              planetX: 0.82,
              planetY: 0.22,
              planetRadius: 0.08,
            }}
            interactive={true}
            windowInteractive={true}
            touch="scroll"
            className="w-full h-full pointer-events-none"
          />
        </div>
      ) : (
        <>
          {/* Ambient Rose & Warm Blush Atmosphere with deep glowing blurs */}
          <div className="fixed top-0 left-1/3 w-[550px] h-[550px] bg-[#D4627A]/15 rounded-full blur-[160px] pointer-events-none z-0" />
          <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E6C29C]/10 rounded-full blur-[170px] pointer-events-none z-0" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#541525]/30 rounded-full blur-[200px] pointer-events-none z-0" />
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(circle at 40% 15%, rgba(212, 98, 122, 0.14) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(230, 194, 156, 0.09) 0%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(84, 21, 37, 0.28) 0%, transparent 70%)',
            }}
          />

          {/* Floating Starlight Particle Background */}
          <ParticleBackground />
        </>
      )}

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
              <span className="font-serif tracking-[0.2em] text-xs font-semibold text-[#FAF4F0]/90 uppercase block">
                The Birthday Experience
              </span>
              <span className="text-[11px] font-sans font-bold tracking-widest text-[#E77C92] uppercase border-l border-[#FAF4F0]/20 pl-2">
                Vol. 20
              </span>
            </div>
            <p className="text-xs text-[#FAF4F0]/80 font-sans tracking-wide">
              Dành riêng cho <span className="text-[#FAF4F0] font-semibold">{config.recipientName}</span>
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          {/* Background Cosmic Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="btn-glass-interactive px-3 py-1.5 text-xs tracking-wide flex items-center gap-1.5"
              title="Đổi hiệu ứng nền vũ trụ Halftone Nebula"
              aria-label="Chọn hiệu ứng nền vũ trụ"
            >
              <Sparkles size={12} className="text-[#E77C92] animate-pulse" />
              <span className="hidden sm:inline">Nền: {THEME_OPTIONS.find((t) => t.id === bgTheme)?.label || 'Nebula'}</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 top-full mt-2 w-48 py-1.5 px-1 bg-[#1a0a14]/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-50 flex flex-col gap-1 text-xs animate-fadeIn">
                <div className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                  <span>Bầu trời vũ trụ</span>
                  <span className="text-[9px] text-[#E77C92]">Pixel Art</span>
                </div>
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors ${
                      bgTheme === theme.id
                        ? 'bg-[#D4627A]/30 text-white font-medium border border-[#D4627A]/40'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{theme.icon}</span>
                      <span>{theme.label}</span>
                    </span>
                    {bgTheme === theme.id && <span className="w-1.5 h-1.5 rounded-full bg-[#E77C92]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Creator Studio & QR Controls (Hidden in Recipient Mode) */}
          {!isRecipientMode && (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Floating Desktop Chapter Rail Sidebar (Lucian UX/UI #417) */}
      <div className="fixed left-3 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <ChapterRailNav
          currentChapter={currentChapter}
          maxUnlockedChapter={maxUnlockedChapter}
          isRecipientMode={isRecipientMode}
          onSelectChapter={onSelectChapter}
          recipientName={config.recipientName}
          memoriesCount={config.memories?.length || 8}
        />
      </div>

      {/* Mobile Floating Chapter Trigger & Drawer */}
      <div className="md:hidden">
        {/* Floating pill button at bottom-left */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="fixed bottom-20 left-4 z-40 btn-glass-interactive px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl text-xs border border-white/20 bg-[#160a12]/90 backdrop-blur-xl cursor-pointer"
          title="Mở danh sách chương"
          aria-label="Mở danh sách chương"
        >
          <span className="w-2 h-2 rounded-full bg-[#E77C92] animate-ping" />
          <span className="font-serif font-bold text-[#E77C92]">{romanNumerals[currentChapter - 1]}</span>
          <span className="text-white/80 text-[11px] font-sans font-medium">{chapterTitles[currentChapter - 1]}</span>
        </button>

        {/* Mobile Slide-in Drawer */}
        {mobileNavOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-start p-4 animate-fadeIn"
            onClick={() => setMobileNavOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="animate-slideInLeft">
              <ChapterRailNav
                currentChapter={currentChapter}
                maxUnlockedChapter={maxUnlockedChapter}
                isRecipientMode={isRecipientMode}
                onSelectChapter={(ch) => {
                  onSelectChapter(ch);
                  setMobileNavOpen(false);
                }}
                recipientName={config.recipientName}
                memoriesCount={config.memories?.length || 8}
              />
            </div>
          </div>
        )}
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
