import React, { useState, useEffect } from 'react';
import './chapter-rail-nav.css';
import { ChapterNumber } from '../../hooks/useBirthdayExperience';

export interface ChapterRailNavProps {
  currentChapter: ChapterNumber;
  maxUnlockedChapter?: number;
  isRecipientMode?: boolean;
  onSelectChapter: (chapter: ChapterNumber) => void;
  recipientName?: string;
  memoriesCount?: number;
  className?: string;
}

export const ChapterRailNav: React.FC<ChapterRailNavProps> = ({
  currentChapter,
  maxUnlockedChapter = 8,
  isRecipientMode = false,
  onSelectChapter,
  recipientName = 'Bạn',
  memoriesCount = 8,
  className = '',
}) => {
  const [isRail, setIsRail] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('birthday_nav_rail');
      if (saved !== null) return saved === 'true';
      // Default to rail on smaller screens, expanded on wider screens
      return window.innerWidth < 1400;
    }
    return true;
  });

  const toggleRail = () => {
    setIsRail((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('birthday_nav_rail', String(next));
      }
      return next;
    });
  };

  const chapters: Array<{
    num: ChapterNumber;
    roman: string;
    title: string;
    badge?: string | number;
    icon: React.ReactNode;
  }> = [
    {
      num: 1,
      roman: 'I',
      title: 'Lời Mời',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2.5 5.2h13a1 1 0 0 1 1 1v7.6a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V6.2a1 1 0 0 1 1-1z" />
          <path d="m2.5 6 6.5 4.5 6.5-4.5" />
        </svg>
      ),
    },
    {
      num: 2,
      roman: 'II',
      title: 'Hộp Quà',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <rect x="2.8" y="7.5" width="12.4" height="7.2" rx="1.5" />
          <path d="M2 4.8h14v2.7H2zM9 4.8v9.9" />
          <path d="M6.5 4.8A2 2 0 1 1 9 2.5V4.8M11.5 4.8A2 2 0 1 0 9 2.5V4.8" />
        </svg>
      ),
    },
    {
      num: 3,
      roman: 'III',
      title: 'Đại Tiệc',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2.8 14.8h12.4M3.8 14.8v-4.2a1 1 0 0 1 1-1h8.4a1 1 0 0 1 1 1v4.2" />
          <path d="M6 9.6V6.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.8M7.5 5.8V3.5M10.5 5.8V3.5" />
        </svg>
      ),
    },
    {
      num: 4,
      roman: 'IV',
      title: 'Ước Nguyện',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 2.2c1.8 2.2 3.8 4.6 3.8 7a3.8 3.8 0 1 1-7.6 0c0-2.4 2-4.8 3.8-7z" />
          <path d="M9 9.5a1.5 1.5 0 0 1 1.5 1.5" />
        </svg>
      ),
    },
    {
      num: 5,
      roman: 'V',
      title: 'Kỷ Niệm',
      badge: memoriesCount > 0 ? memoriesCount : undefined,
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <rect x="2.5" y="4" width="13" height="10.8" rx="2.2" />
          <circle cx="9" cy="9.4" r="2.6" />
          <path d="M5.8 4l1-1.8h4.4l1 1.8" />
        </svg>
      ),
    },
    {
      num: 6,
      roman: 'VI',
      title: 'Thử Thách',
      badge: 3,
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <rect x="2" y="5.2" width="14" height="9" rx="3.5" />
          <path d="M5.5 9.7h3M7 8.2v3M12.5 8.7h.01M13.5 10.7h.01" />
        </svg>
      ),
    },
    {
      num: 7,
      roman: 'VII',
      title: 'Bức Thư',
      badge: '❤️',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3.5 3.5h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" />
          <path d="M9 7.8c-.8-.9-2.1-.6-2.4.5-.3 1.2 1.2 2.4 2.4 3.2 1.2-.8 2.7-2 2.4-3.2-.3-1.1-1.6-1.4-2.4-.5z" />
        </svg>
      ),
    },
    {
      num: 8,
      roman: 'VIII',
      title: 'Bất Ngờ',
      icon: (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="m9 2 1.5 4 4 1.5-4 1.5L9 13l-1.5-4-4-1.5 4-1.5z" />
          <path d="m14 11.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </svg>
      ),
    },
  ];

  const activeIdx = Math.max(0, Math.min(7, currentChapter - 1));

  // Keyboard navigation support (ArrowUp, ArrowDown)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowDown') nextIdx = Math.min(7, index + 1);
    if (e.key === 'ArrowUp') nextIdx = Math.max(0, index - 1);

    if (nextIdx !== null) {
      const targetChapter = (nextIdx + 1) as ChapterNumber;
      if (!isRecipientMode || targetChapter <= maxUnlockedChapter) {
        e.preventDefault();
        onSelectChapter(targetChapter);
      }
    }
  };

  return (
    <div className={`u417-wrapper ${isRail ? 'is-rail' : ''} ${className}`}>
      <aside className="u417-sb" aria-label="Thanh điều hướng chương">
        {/* Header / Brand */}
        <div className="u417-hd">
          <span className="u417-mk" aria-hidden="true" title="The Birthday Experience">
            <svg viewBox="0 0 17 17">
              <path d="M3.7 10.8a4.8 4.8 0 0 1 9.6 0" />
              <path d="M2.2 13.8h12.6" />
            </svg>
          </span>
          <b className="u417-lb" title={`Thiệp mừng sinh nhật ${recipientName}`}>
            Chương {chapters[activeIdx].roman} • {chapters[activeIdx].title}
          </b>
        </div>

        {/* Navigation List */}
        <ul className="u417-nav" role="tablist">
          {/* Animated Spring Sliding Pill */}
          <li
            className="u417-pl"
            aria-hidden="true"
            style={{
              transform: `translateY(${activeIdx * 42}px)`,
            }}
          />

          {chapters.map((ch, idx) => {
            const isCurrent = ch.num === currentChapter;
            const isLocked = isRecipientMode && ch.num > maxUnlockedChapter;

            return (
              <li key={ch.num} role="presentation">
                <button
                  type="button"
                  className={`u417-it ${isLocked ? 'opacity-30 cursor-not-allowed' : ''}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  disabled={isLocked}
                  onClick={() => !isLocked && onSelectChapter(ch.num)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  title={
                    isLocked
                      ? `Chương ${ch.roman}: ${ch.title} (Chưa mở khóa)`
                      : `Chương ${ch.roman}: ${ch.title}`
                  }
                >
                  {/* SVG Icon */}
                  {ch.icon}

                  {/* Label */}
                  <span className="u417-lb">
                    Chương {ch.roman} · {ch.title}
                  </span>

                  {/* Badge */}
                  {ch.badge && !isLocked && (
                    <span className="u417-bd" aria-hidden="true">
                      {ch.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Floating Toggle Button */}
        <button
          className="u417-tg"
          type="button"
          onClick={toggleRail}
          aria-expanded={!isRail}
          aria-label={isRail ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          title={isRail ? 'Mở rộng' : 'Thu gọn'}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M7.5 2.5 4 6l3.5 3.5" />
          </svg>
        </button>
      </aside>
    </div>
  );
};

export default ChapterRailNav;
