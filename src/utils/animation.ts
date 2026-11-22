import confetti from 'canvas-confetti';

// Superr Vibrant Schoolyard Sticker Palette
export const SUPERR_CONFETTI_COLORS = [
  '#FF6F1E', // Marker Orange
  '#FF66CF', // Bubblegum Pink
  '#3B82F6', // Sky Blue
  '#22C55E', // Sprout Green
  '#FBBF24', // Sunshine Gold
  '#FDFBF9', // Cream Paper
];

/**
 * Triggers a joyful burst of Superr confetti
 */
export const triggerBirthdayConfetti = () => {
  // Center burst
  confetti({
    particleCount: 85,
    spread: 75,
    origin: { y: 0.6 },
    colors: SUPERR_CONFETTI_COLORS,
  });

  // Left pop
  setTimeout(() => {
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: SUPERR_CONFETTI_COLORS,
    });
  }, 180);

  // Right pop
  setTimeout(() => {
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: SUPERR_CONFETTI_COLORS,
    });
  }, 320);
};

/**
 * Continuous celebration confetti rain
 */
export const triggerContinuousConfetti = (durationMs: number = 3000) => {
  const end = Date.now() + durationMs;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: SUPERR_CONFETTI_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: SUPERR_CONFETTI_COLORS,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};
