import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../utils/helpers';
import './TransactionForm.css';

const TransactionForm = ({ onAddTransaction }) => {
  const [type, setType] = useState('income');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'salary',
    date: new Date().toISOString().split('T')[0],
  });

  const handleTypeChange = (newType) => {
    setType(newType);
    setFormData({
      ...formData,
      category: CATEGORIES[newType][0].value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transaction = {
      id: Date.now(),
      type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      // store full ISO datetime so charts can group by hour for 'daily'
      date: new Date(`${formData.date}T${new Date().toISOString().split('T')[1]}`).toISOString(),
    };

    onAddTransaction(transaction);

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: CATEGORIES[type][0].value,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      className="add-section"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="section-title">Add Transaction</h2>

      <div className="type-toggle">
        <button
          type="button"
          className={`type-btn income ${type === 'income' ? 'active' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="e.g., Monthly Salary"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Transaction
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
