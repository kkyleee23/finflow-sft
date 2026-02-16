import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // dura. of loading
    const duration = 3500;
    const tick = 50; // update interval in ms
    const totalTicks = Math.max(1, Math.ceil(duration / tick));
    const increment = 100 / totalTicks;

    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      setProgress((prev) => {
        const next = Math.min(100, prev + increment);
        if (ticks >= totalTicks) {
          clearInterval(interval);
          // give a short moment to show full bar before completing
          setTimeout(() => onLoadingComplete(), 500);
        }
        return next;
      });
    }, tick);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="loading-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="loading-logo"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <motion.path
                d="M30 5L50 15V35L30 45L10 35V15L30 5Z"
                stroke="var(--accent-green)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="30"
                cy="25"
                r="8"
                fill="var(--accent-green)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </svg>
          </motion.div>
          
          <motion.h1
            className="loading-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            FinFlow
          </motion.h1>
          
          <motion.p
            className="loading-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Smart Finance Tracking
          </motion.p>

          <motion.p
            className="loading-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            by @kkyleee23
          </motion.p>

          <div className="loading-bar-container">
            <motion.div
              className="loading-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
