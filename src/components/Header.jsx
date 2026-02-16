import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import InfoModal from './InfoModal';
import './Header.css';

const Header = () => {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen((v) => !v);

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-content">
        <div>
          <h1 className="logo">FinFlow</h1>
          <p className="tagline">Smart Finance Tracking</p>
        </div>
        <motion.button
          className="theme-toggle"
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="App info"
        >
          <Info size={18} />
        </motion.button>
        <InfoModal open={open} onClose={() => setOpen(false)} />
      </div>
    </motion.header>
  );
};

export default Header;
