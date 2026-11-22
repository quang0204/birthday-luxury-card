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
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.02, y: -14 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 relative z-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
