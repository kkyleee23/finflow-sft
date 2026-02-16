import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/helpers';
import { useFilter } from '../context/FilterContext';
import './StatCard.css';

const StatCard = ({ label, value, type, index }) => {
  const { timePeriod } = useFilter();

  const getPeriodText = () => {
    switch (timePeriod) {
      case 'daily': return 'Today';
      case 'weekly': return 'This week';
      case 'monthly': return 'This month';
      case 'yearly': return 'This year';
      case 'all': return 'All time';
      default: return 'This month';
    }
  };

  return (
    <motion.div
      className={`stat-card ${type}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">{formatCurrency(value)}</div>
      <div className="stat-change">{getPeriodText()}</div>
    </motion.div>
  );
};

export default StatCard;
