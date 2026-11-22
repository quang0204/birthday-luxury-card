import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { MemoryItem } from '../../config/birthday.config';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PhotoSphere3DProps {
  memories: MemoryItem[];
  onSelectPhoto: (photo: MemoryItem) => void;
}

interface SphereCard {
  memory: MemoryItem;
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateX: number;
}

export const PhotoSphere3D: React.FC<PhotoSphere3DProps> = ({ memories, onSelectPhoto }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Rotation state
  const rotRef = useRef({ x: 10, y: 0 });
  const velRef = useRef({ x: 0, y: 0.35 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, moved: false });
  const animFrameRef = useRef<number | null>(null);

  const [sphereRotation, setSphereRotation] = useState({ x: 10, y: 0 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Responsive radius
  const [radius, setRadius] = useState(210);

  useEffect(() => {
    const updateRadius = () => {
      if (typeof window !== 'undefined') {
        setRadius(window.innerWidth < 640 ? 165 : 220);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Multiply memories so the sphere has 16-20 cards nicely distributed around the globe
  const sphereItems = useMemo(() => {
    if (!memories || memories.length === 0) return [];
    const count = 18;
    const items: MemoryItem[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        ...memories[i % memories.length],
        id: `${memories[i % memories.length].id}-${i}`,
      });
    }
    return items;
  }, [memories]);

  // Fibonacci Sphere points calculation
  const cards: SphereCard[] = useMemo(() => {
    const N = sphereItems.length;
    if (N === 0) return [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    return sphereItems.map((item, i) => {
      const y = 1 - (i / (N - 1)) * 2; // from 1 down to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenRatio * i * Math.PI * 2;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Surface normal angles
      const rotY = (Math.atan2(x, z) * 180) / Math.PI;
      const rotX = (-Math.asin(y) * 180) / Math.PI;

      return {
        memory: item,
        x: x * radius,
        y: y * radius,
        z: z * radius,
        rotateY: rotY,
        rotateX: rotX,
      };
    });
  }, [sphereItems, radius]);

  // Animation Loop with inertia and auto-spin
  useEffect(() => {
    const loop = () => {
      if (!isDraggingRef.current && !reducedMotion) {
        // Friction / damping on velocity
        velRef.current.x *= 0.95;
        velRef.current.y *= 0.95;

        // Auto gentle idle orbit
        if (Math.abs(velRef.current.y) < 0.25) {
          velRef.current.y = 0.25;
        }

        rotRef.current.x += velRef.current.x;
        rotRef.current.y += velRef.current.y;

        // Clamp vertical tilt
        rotRef.current.x = Math.max(-55, Math.min(55, rotRef.current.x));

        setSphereRotation({ x: rotRef.current.x, y: rotRef.current.y });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion]);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
    velRef.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStartRef.current.moved = true;
    }

    velRef.current = {
      x: -dy * 0.35,
      y: dx * 0.35,
    };

    rotRef.current.x += velRef.current.x;
    rotRef.current.y += velRef.current.y;
    rotRef.current.x = Math.max(-55, Math.min(55, rotRef.current.x));

    dragStartRef.current.x = e.clientX;
    dragStartRef.current.y = e.clientY;

    setSphereRotation({ x: rotRef.current.x, y: rotRef.current.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleCardClick = (memory: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragStartRef.current.moved) {
      // Was dragging to spin, don't open
      return;
    }
    onSelectPhoto(memory);
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[540px] flex items-center justify-center select-none overflow-hidden touch-none my-2">
      {/* Center glowing Mist Orb plasma core inside the sphere */}
      <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full pointer-events-none z-0 flex items-center justify-center">
        {/* Deep ambient plasma aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7E22CE] via-[#D946EF] to-[#FF6F1E] opacity-50 blur-3xl animate-pulse" />
        {/* Inner incandescent core */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-t from-[#FF6F1E] via-[#FBBF24] to-white opacity-40 blur-xl animate-float-gentle" />
      </div>

      {/* 3D Sphere Interactive Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1100px' }}
      >
        {/* Rotating 3D Sphere Center */}
        <div
          className="relative w-0 h-0 flex items-center justify-center transition-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${sphereRotation.x}deg) rotateY(${sphereRotation.y}deg)`,
          }}
        >
          {cards.map((card, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={i}
                onClick={(e) => handleCardClick(card.memory, e)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="absolute w-22 sm:w-26 p-1.5 sm:p-2 rounded-xl bg-[#FDFBF9] text-[#2B1A07] border-2 border-[#2B1A07] shadow-sticker cursor-pointer transition-all duration-200 group flex flex-col items-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotateY(${card.rotateY}deg) rotateX(${card.rotateX}deg) ${
                    isHovered ? 'scale(1.28)' : 'scale(1)'
                  }`,
                  backfaceVisibility: 'visible',
                  zIndex: isHovered ? 50 : undefined,
                }}
              >
                {/* Micro Sticker */}
                {card.memory.sticker && (
                  <div className="absolute -top-2 -right-2 text-sm z-20 filter drop-shadow">
                    {card.memory.sticker}
                  </div>
                )}

                {/* Photo frame */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 border border-[#2B1A07]">
                  <img
                    src={card.memory.image}
                    alt={card.memory.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Touch / Hover eye hint */}
                  <div className="absolute inset-0 bg-[#FF6F1E]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-display font-black">
                    <span>Xem</span>
                  </div>
                </div>

                {/* Bottom mini caption */}
                <div className="pt-1 text-center w-full">
                  <span className="font-display font-black text-[10px] sm:text-[11px] text-[#2B1A07] block truncate leading-tight">
                    {card.memory.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Drag/Spin Helper Pill */}
      <div className="absolute bottom-2 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#130B1C]/85 border border-[#FBBF24]/40 text-[#FBBF24] text-[11px] font-display font-bold shadow-md">
        <span>👆 Dùng tay hoặc chuột để XOAY quả cầu ảnh 360° • Chạm ảnh để xem</span>
      </div>
    </div>
  );
};
