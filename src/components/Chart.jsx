import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getChartData } from '../utils/helpers';
import { useFilter } from '../context/FilterContext';
import './Chart.css';

const Chart = ({ transactions }) => {
  const { timePeriod } = useFilter();
  const chartData = getChartData(transactions, timePeriod);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-income">Income: ${payload[0].value.toFixed(2)}</p>
          <p className="tooltip-expense">Expense: ${payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const getPeriodLabel = () => {
    switch (timePeriod) {
      case 'daily': return 'Today Overview';
      case 'weekly': return 'Weekly Overview';
      case 'monthly': return 'Monthly Overview';
      case 'yearly': return 'Yearly Overview';
      case 'all': return 'All Time Overview';
      default: return 'Overview';
    }
  };

  return (
    <motion.div
      className="chart-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="section-title">{getPeriodLabel()}</h2>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            style={{
              fontSize: '0.75rem',
              fontFamily: 'Work Sans',
              fill: 'var(--warm-gray)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar dataKey="income" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-income-${index}`} fill="var(--accent-green)" opacity={0.8} />
            ))}
          </Bar>
          <Bar dataKey="expense" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-expense-${index}`} fill="var(--accent-red)" opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Chart;
