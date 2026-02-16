import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';
import './InfoModal.css';

const InfoModal = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="info-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="info-modal"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button className="info-close" onClick={onClose} aria-label="Close info">×</button>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <img src={logo} alt="FinFlow logo" style={{width:40,height:40}} />
              <h3>FinFlow</h3>
            </div>
            <p>Smart Finance Tracking — lightweight personal finance app.</p>
            <div className="info-section">
              <strong>Web Dev</strong>
              <p>@kkyleee23</p>
            </div>
            <div className="info-section">
              <strong>Credits</strong>
              <p>Built with React, Vite, Recharts and Framer Motion for animation.</p>
            </div>
            <div className="info-section">
              <strong>Version</strong>
              <p>1.0</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
