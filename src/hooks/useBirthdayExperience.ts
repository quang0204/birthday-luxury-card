import { useState, useCallback } from 'react';

export type ChapterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface BirthdayState {
  currentChapter: ChapterNumber;
  isEnvelopeOpened: boolean;
  isGiftOpened: boolean;
  areCandlesBlown: boolean;
  currentMemoryIndex: number;
  gameCompleted: boolean;
  isLetterOpened: boolean;
  isSurpriseRevealed: boolean;
  isQRModalOpen: boolean;
}

export const useBirthdayExperience = () => {
  const [currentChapter, setCurrentChapter] = useState<ChapterNumber>(1);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [areCandlesBlown, setAreCandlesBlown] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [isSurpriseRevealed, setIsSurpriseRevealed] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const goToChapter = useCallback((chapter: ChapterNumber) => {
    setCurrentChapter(chapter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextChapter = useCallback(() => {
    setCurrentChapter((prev) => {
      const next = Math.min(prev + 1, 8) as ChapterNumber;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  }, []);

  const prevChapter = useCallback(() => {
    setCurrentChapter((prev) => {
      const prevChap = Math.max(prev - 1, 1) as ChapterNumber;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return prevChap;
    });
  }, []);

  const resetExperience = useCallback(() => {
    setCurrentChapter(1);
    setIsEnvelopeOpened(false);
    setIsGiftOpened(false);
    setAreCandlesBlown(false);
    setCurrentMemoryIndex(0);
    setGameCompleted(false);
    setIsLetterOpened(false);
    setIsSurpriseRevealed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentChapter,
    isEnvelopeOpened,
    setIsEnvelopeOpened,
    isGiftOpened,
    setIsGiftOpened,
    areCandlesBlown,
    setAreCandlesBlown,
    currentMemoryIndex,
    setCurrentMemoryIndex,
    gameCompleted,
    setGameCompleted,
    isLetterOpened,
    setIsLetterOpened,
    isSurpriseRevealed,
    setIsSurpriseRevealed,
    isQRModalOpen,
    setIsQRModalOpen,
    goToChapter,
    nextChapter,
    prevChapter,
    resetExperience,
  };
};
