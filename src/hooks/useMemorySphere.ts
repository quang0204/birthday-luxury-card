import { useState, useMemo, useEffect } from 'react';
import { Memory, defaultMemories } from '../data/memories';
import { MemoryItem } from '../config/birthday.config';
import { normalizeMemory } from '../utils/memoryHelpers';
import { useMemorySelection } from './useMemorySelection';

export function useMemorySphere(
  inputMemories?: (Memory | MemoryItem)[],
  playClick?: () => void
) {
  const [viewMode, setViewMode] = useState<'sphere' | 'grid'>('sphere');
  const [hasWebGL, setHasWebGL] = useState(true);

  // Normalize memories or fallback to rich default memories
  const memories: Memory[] = useMemo(() => {
    if (Array.isArray(inputMemories)) {
      return inputMemories.map((m, i) => normalizeMemory(m, i));
    }
    return defaultMemories;
  }, [inputMemories]);

  // WebGL support check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        setViewMode('grid');
      }
    } catch {
      setHasWebGL(false);
      setViewMode('grid');
    }
  }, []);

  const selection = useMemorySelection(memories, playClick);

  return {
    memories,
    viewMode: hasWebGL ? viewMode : 'grid',
    setViewMode,
    hasWebGL,
    ...selection,
  };
}
