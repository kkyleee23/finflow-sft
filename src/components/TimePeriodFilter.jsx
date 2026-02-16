import React from 'react';
import { motion } from 'framer-motion';
import { useFilter } from '../context/FilterContext';
import './TimePeriodFilter.css';

const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'all', label: 'All Time' },
];

const TimePeriodFilter = () => {
  const { timePeriod, setTimePeriod } = useFilter();

  return (
    <motion.div
      className="time-period-filter"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="period-buttons">
        {periods.map((period) => (
          <motion.button
            key={period.value}
            className={`period-btn ${timePeriod === period.value ? 'active' : ''}`}
            onClick={() => setTimePeriod(period.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {period.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TimePeriodFilter;
