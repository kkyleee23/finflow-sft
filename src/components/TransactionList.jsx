import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryIcon, sortTransactions, searchTransactions } from '../utils/helpers';
import { useFilter } from '../context/FilterContext';
import './TransactionList.css';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('all');
  const { searchQuery, setSearchQuery, sortBy, setSortBy } = useFilter();

  let filtered = transactions.filter((t) => {
    if (filter !== 'all' && t.type !== filter) return false;
    return true;
  });

  // searhc
  filtered = searchTransactions(filtered, searchQuery);

  filtered = sortTransactions(filtered, sortBy);

  const handleSortChange = () => {
    const sortOptions = ['date-desc', 'date-asc', 'amount-desc', 'amount-asc'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'date-desc': return 'Newest First';
      case 'date-asc': return 'Oldest First';
      case 'amount-desc': return 'Highest Amount';
      case 'amount-asc': return 'Lowest Amount';
      default: return 'Sort';
    }
  };

  return (
    <motion.div
      className="transactions-section"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="transactions-header">
        <h2 className="section-title">Transactions</h2>
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Income
          </button>
          <button
            className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="transaction-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="sort-btn" onClick={handleSortChange}>
          <ArrowUpDown size={14} />
          {getSortLabel()}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No {filter === 'all' ? '' : filter} transactions found.</p>
        </div>
      ) : (
        <ul className="transaction-list">
          <AnimatePresence>
            {filtered.map((transaction, index) => (
              <motion.li
                key={transaction.id}
                className="transaction-item"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className={`transaction-icon ${transaction.type}`}>
                  {getCategoryIcon(transaction.category, transaction.type)}
                </div>
                <div className="transaction-info">
                  <h4>{transaction.description}</h4>
                  <div className="transaction-meta">
                    {transaction.category.charAt(0).toUpperCase() +
                      transaction.category.slice(1)}{' '}
                    • {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="transaction-amount">
                  <div className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <motion.button
                    className="delete-btn"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default TransactionList;
