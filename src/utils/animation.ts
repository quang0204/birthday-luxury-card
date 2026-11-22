import confetti from 'canvas-confetti';

/**
 * Triggers a joyful burst of confetti with custom celebration colors
 */
export const triggerBirthdayConfetti = () => {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF5E8E', '#B794F6', '#FCD34D', '#FFFDF9', '#FFA4BD']
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FF5E8E', '#FCD34D', '#E4D5FF']
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#B794F6', '#FFA4BD', '#FCD34D']
    });
  }, 350);
};

/**
 * Grand celebration continuous confetti rain
 */
export const triggerContinuousConfetti = (durationMs: number = 3000) => {
  const end = Date.now() + durationMs;
  const colors = ['#FF5E8E', '#B794F6', '#FCD34D', '#FFFDF9', '#FFA4BD'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

/**
 * Common Framer Motion animation variants
 */
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.4 } }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: 'spring', damping: 20, stiffness: 120 } 
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};
