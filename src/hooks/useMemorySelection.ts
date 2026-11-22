import { useState, useCallback, useEffect } from 'react';
import { Memory } from '../data/memories';
import { triggerBirthdayConfetti } from '../utils/animation';

export function useMemorySelection(memories: Memory[], playClick?: () => void) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const currentIndex = selectedMemory
    ? memories.findIndex((m) => m.id === selectedMemory.id || m.title === selectedMemory.title)
    : -1;

  const openDetail = useCallback((memory: Memory) => {
    if (playClick) playClick();
    setSelectedMemory(memory);
  }, [playClick]);

  const closeDetail = useCallback(() => {
    if (playClick) playClick();
    setSelectedMemory(null);
  }, [playClick]);

  const nextMemory = useCallback(() => {
    if (memories.length === 0) return;
    if (playClick) playClick();
    const nextIdx = (currentIndex + 1) % memories.length;
    setSelectedMemory(memories[nextIdx]);
  }, [currentIndex, memories, playClick]);

  const prevMemory = useCallback(() => {
    if (memories.length === 0) return;
    if (playClick) playClick();
    const prevIdx = (currentIndex - 1 + memories.length) % memories.length;
    setSelectedMemory(memories[prevIdx]);
  }, [currentIndex, memories, playClick]);

  const randomMemory = useCallback(() => {
    if (memories.length === 0) return;
    if (playClick) playClick();
    const randomIdx = Math.floor(Math.random() * memories.length);
    setSelectedMemory(memories[randomIdx]);
  }, [memories, playClick]);

  const toggleLike = useCallback((id: string) => {
    if (playClick) playClick();
    setLikedMap((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        triggerBirthdayConfetti();
      }
      return { ...prev, [id]: nextState };
    });
  }, [playClick]);

  // Keyboard navigation when detail modal is open
  useEffect(() => {
    if (!selectedMemory) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDetail();
      } else if (e.key === 'ArrowRight') {
        nextMemory();
      } else if (e.key === 'ArrowLeft') {
        prevMemory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, closeDetail, nextMemory, prevMemory]);

  return {
    selectedMemory,
    selectedIndex: currentIndex,
    hoveredId,
    setHoveredId,
    likedMap,
    isModalOpen: !!selectedMemory,
    openDetail,
    closeDetail,
    nextMemory,
    prevMemory,
    randomMemory,
    toggleLike,
  };
}
