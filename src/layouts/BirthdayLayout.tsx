import React, { useState, useEffect } from 'react';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { MusicController } from '../components/common/MusicController';
import HalftoneNebula, { NEBULA_PRESETS } from '../components/ui/halftone-nebula';
import { ChapterNumber } from '../hooks/useBirthdayExperience';
import { Sparkles, QrCode, PenTool, Layers, Menu as MenuIcon, X, BookOpen } from 'lucide-react';
import { MenuItem, MenuContainer } from '../components/ui/fluid-menu';
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
    'Ước Nguyện',
    'Kỷ Niệm',
    'Thử Thách',
    'Bức Thư',
    'Bất Ngờ',
  ];

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

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
              <span className="font-serif tracking-[0.2em] text-xs font-semibold text-[#FAF4F0] uppercase block drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                The Birthday Experience
              </span>
              <span className="text-[11px] font-sans font-bold tracking-widest text-[#FF9EAF] uppercase border-l border-[#FAF4F0]/30 pl-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                Vol. 20
              </span>
            </div>
            <p className="text-xs text-[#FAF4F0]/95 font-sans tracking-wide subcaption-contrast">
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

      {/* Floating Chapter Trigger & Drawer with Fluid Menu (Visible on Desktop & Mobile) */}
      <div className="z-50">
        {/* Floating Fluid Menu at bottom-left */}
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
          <MenuContainer
            direction="up"
            triggerClassName="bg-[#180d15]/95 border border-[#E77C92]/40 text-[#FAF4F0] shadow-2xl backdrop-blur-xl hover:border-[#E77C92]"
            itemClassName="bg-[#1f101a]/95 border border-white/20 text-[#FAF4F0] shadow-2xl backdrop-blur-xl hover:border-[#E77C92]"
            spacing={56}
          >
            {/* Trigger Button */}
            <MenuItem
              title="Menu điều hướng"
              icon={
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180 flex items-center justify-center">
                    <MenuIcon size={22} className="text-[#E77C92]" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0 flex items-center justify-center">
                    <X size={22} className="text-[#E77C92]" strokeWidth={2} />
                  </div>
                </div>
              }
            />

            {/* Item 1: Open Chapter List Drawer */}
            <MenuItem
              title="Danh sách chương"
              onClick={() => setMobileNavOpen(true)}
              icon={<BookOpen size={20} className="text-[#E77C92]" />}
            />

            {/* Item 2: QR Code modal */}
            <MenuItem
              title="Mã QR & Thiệp in"
              onClick={onOpenQR}
              icon={<QrCode size={20} className="text-[#FAF4F0]" />}
            />

            {/* Item 3: Cosmic Background Theme */}
            <MenuItem
              title="Đổi vũ trụ sao"
              onClick={() => setShowThemePicker((prev) => !prev)}
              icon={<Sparkles size={20} className="text-[#E6C29C]" />}
            />

            {/* Item 4: Dashboard or Creator */}
            {!isRecipientMode && onOpenDashboard ? (
              <MenuItem
                title="Kho thiệp"
                onClick={onOpenDashboard}
                icon={<Layers size={20} className="text-[#FAF4F0]" />}
              />
            ) : (
              <MenuItem
                title="Chỉnh sửa thiệp"
                onClick={onOpenCreator}
                icon={<PenTool size={20} className="text-[#FAF4F0]" />}
              />
            )}
          </MenuContainer>

          {/* Quick Chapter Pill Badge */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="btn-glass-interactive px-3 py-2 rounded-full flex items-center gap-2 shadow-2xl text-xs border border-white/20 bg-[#160a12]/90 backdrop-blur-xl cursor-pointer"
            title="Mở danh sách chương"
            aria-label="Mở danh sách chương"
          >
            <span className="w-2 h-2 rounded-full bg-[#E77C92] animate-ping" />
            <span className="font-serif font-bold text-[#E77C92]">{romanNumerals[currentChapter - 1]}</span>
            <span className="text-white text-xs font-sans font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">{chapterTitles[currentChapter - 1]}</span>
          </button>
        </div>

        {/* Chapter Selection Drawer */}
        {mobileNavOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-start p-4 sm:p-6 animate-fadeIn"
            onClick={() => setMobileNavOpen(false)}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="animate-slideInLeft max-w-sm w-full bg-[#180b14]/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-[#FAF4F0] uppercase tracking-wider">
                    Danh Sách 7 Chương
                  </h3>
                  <p className="text-xs text-white/80 font-sans mt-0.5">Chọn một chương để di chuyển nhanh</p>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {chapterTitles.map((title, idx) => {
                  const chNum = (idx + 1) as ChapterNumber;
                  const isActive = currentChapter === chNum;
                  return (
                    <button
                      key={chNum}
                      onClick={() => {
                        onSelectChapter(chNum);
                        setMobileNavOpen(false);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-sans transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#D4627A] text-white font-semibold shadow-md'
                          : 'text-[#FAF4F0]/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-[#E77C92] w-6 text-center">
                          {romanNumerals[idx]}
                        </span>
                        <span>{title}</span>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Stage Content */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-20 w-full max-w-4xl mx-auto py-3 px-3 sm:px-6">
        {children}
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="safe-bottom relative z-20 py-6 px-4 flex justify-center text-xs text-[#FAF4F0]/70 font-medium font-sans tracking-widest uppercase subcaption-contrast">
        The Birthday Experience • {config.recipientName}
      </footer>
    </div>
  );
};
