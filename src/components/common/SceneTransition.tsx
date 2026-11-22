import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SceneTransitionProps {
  currentKey: string | number;
  children: React.ReactNode;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({ currentKey, children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentKey}
        initial={{ opacity: 0, scale: 0.96, y: 16, filter: 'blur(3px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.02, y: -14, filter: 'blur(3px)' }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 relative z-10 will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
