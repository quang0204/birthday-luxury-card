import React from 'react';
import { motion, useSpring } from 'framer-motion';

interface BirthdayCake3DProps {
  candlesLit: boolean;
  isBlowing?: boolean;
  onCakeClick?: () => void;
}

export const BirthdayCake3D: React.FC<BirthdayCake3DProps> = ({
  candlesLit,
  isBlowing = false,
  onCakeClick
}) => {
  const rotateX = useSpring(8, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -15 + 8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    rotateX.set(x);
    rotateY.set(y);
  };

  const handleMouseLeave = () => {
    rotateX.set(8);
    rotateY.set(0);
  };

  return (
    <div
      className="relative flex items-center justify-center select-none py-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-2xl"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onCakeClick}
      role="region"
      aria-label="Bánh sinh nhật 3D với nến lung linh"
    >
      {/* Ambient candle flame warm glow aura (gradient optimized) */}
      <div
        className={`absolute w-72 h-72 rounded-full pointer-events-none transition-opacity duration-700 ${
          candlesLit
            ? isBlowing
              ? 'opacity-80 scale-110'
              : 'opacity-50'
            : 'opacity-10 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 68%)',
        }}
      />

      {/* Main 3D Cake Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -6, 0]
        }}
        transition={{
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
        }}
        className="relative w-64 sm:w-72 flex flex-col items-center will-change-transform"
      >
        {/* CANDLES SECTION (3 Candles) */}
        <div className="relative z-30 flex items-end justify-center gap-6 sm:gap-8 mb-[-6px]">
          {[0, 1, 2].map((idx) => {
            const candleHeight = idx === 1 ? 'h-14 sm:h-16' : 'h-12 sm:h-14';
            const flameDelay = idx * 0.15;

            return (
              <div key={idx} className="relative flex flex-col items-center">
                {/* FLAME & SMOKE */}
                {candlesLit ? (
                  <motion.div
                    animate={
                      isBlowing
                        ? {
                            scale: [1, 0.7, 1.2, 0.4],
                            x: [0, -6, 8, -4],
                            opacity: [1, 0.7, 0.9, 0.5]
                          }
                        : {
                            scale: [1, 1.08, 0.96, 1.04],
                            x: [0, -1, 1.5, 0],
                            rotate: [0, -3, 3, 0]
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isBlowing ? 0.25 : 0.9 + flameDelay,
                      ease: 'easeInOut'
                    }}
                    className="relative w-4 h-7 mb-1 flex items-center justify-center origin-bottom"
                  >
                    {/* Outer orange flame */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500 via-yellow-400 to-rose-400 rounded-full blur-[0.6px] shadow-[0_0_12px_#F59E0B]" />
                    {/* Inner yellow-white core */}
                    <div className="absolute w-2 h-4 bottom-0.5 bg-gradient-to-t from-white via-yellow-100 to-transparent rounded-full" />
                    {/* Blue base spark */}
                    <div className="absolute w-2.5 h-1.5 bottom-0 bg-blue-500 rounded-full opacity-60 blur-[0.5px]" />
                  </motion.div>
                ) : (
                  /* Smoke particle puff rising when extinguished */
                  <div className="relative w-4 h-10 mb-1 flex flex-col items-center pointer-events-none">
                    <motion.div
                      initial={{ y: 0, opacity: 0.8, scale: 0.5 }}
                      animate={{ y: -30, opacity: 0, scale: 2, x: (idx - 1) * 8 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      className="w-2.5 h-2.5 bg-white/40 rounded-full blur-sm"
                    />
                    <div className="w-0.5 h-2 bg-neutral-600 rounded-full mt-auto" />
                  </div>
                )}

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-neutral-800 rounded-full" />

                {/* Candle Stick */}
                <div
                  className={`w-3.5 sm:w-4 ${candleHeight} rounded-t-sm bg-gradient-to-r from-pink-300 via-rose-100 to-pink-400 border border-pink-200/40 shadow-md relative overflow-hidden`}
                >
                  {/* Candle decorative diagonal stripes */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(244,63,94,0.4)_4px,rgba(244,63,94,0.4)_8px)]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* TOP CAKE LAYER (Small Tier) */}
        <div className="relative z-20 w-44 sm:w-48 h-18 sm:h-20 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FCE7F3] to-[#FBCFE8] border border-pink-200/60 shadow-xl flex flex-col justify-between overflow-hidden">
          {/* Top frosting drips */}
          <div className="h-5 w-full bg-gradient-to-r from-rose-300 via-rose-400 to-pink-300 flex items-center justify-around px-1 shadow-inner">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-rose-300 rounded-full -mb-2 shadow-sm" />
            ))}
          </div>

          {/* Strawberry & cherry decor */}
          <div className="flex justify-around items-center px-4 my-auto">
            <span className="text-sm filter drop-shadow">🍓</span>
            <span className="text-xs filter drop-shadow">✨</span>
            <span className="text-sm filter drop-shadow">🍓</span>
            <span className="text-xs filter drop-shadow">✨</span>
            <span className="text-sm filter drop-shadow">🍓</span>
          </div>

          {/* Cream piping bottom border */}
          <div className="h-2 w-full bg-gradient-to-r from-pink-200 via-white to-pink-200 opacity-80" />
        </div>

        {/* BOTTOM CAKE LAYER (Large Tier) */}
        <div className="relative z-10 w-56 sm:w-64 h-22 sm:h-24 -mt-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FCE7F3] to-[#F472B6] border border-pink-300/70 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Dripping Chocolate/Berry Glaze */}
          <div className="h-6 w-full bg-gradient-to-r from-[#881337] via-[#9F1239] to-[#881337] flex items-center justify-around px-2 shadow-inner">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-4 bg-[#881337] rounded-b-full shadow-sm"
                style={{ height: `${12 + (i % 3) * 5}px`, marginTop: '4px' }}
              />
            ))}
          </div>

          {/* Golden Pearl Frosting Ornaments */}
          <div className="flex justify-around items-center px-6 my-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-100 shadow-glow-gold/40 border border-amber-200/60"
              />
            ))}
          </div>

          {/* Tier base ribbon */}
          <div className="h-3 w-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 shadow-sm" />
        </div>

        {/* GOLDEN CAKE STAND / PLATTER */}
        <div className="relative z-0 w-64 sm:w-72 h-5 -mt-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-amber-200/50 flex items-center justify-center">
          <div className="w-56 h-1 bg-amber-200/50 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
