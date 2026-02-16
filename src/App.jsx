import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateStats, filterTransactionsByPeriod } from './utils/helpers';
import { FilterProvider, useFilter } from './context/FilterContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import StatCard from './components/StatCard';
import TimePeriodFilter from './components/TimePeriodFilter';
import Chart from './components/Chart';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import DataControls from './components/DataControls';
import './App.css';

function AppContent() {
  const [transactions, setTransactions] = useLocalStorage('finflow-transactions', []);
  const [isLoading, setIsLoading] = useState(true);
  const { timePeriod } = useFilter();

  // transac, time periods
  const filteredTransactions = filterTransactionsByPeriod(transactions, timePeriod);
  const stats = calculateStats(filteredTransactions);

  const handleAddTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const handleImport = (importedTransactions) => {
    setTransactions(importedTransactions);
  };

  const handleClear = () => {
    setTransactions([]);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="app">
      <div className="container">
        <Header />

        <TimePeriodFilter />

        <div className="stats-grid">
          <StatCard label="Total Income" value={stats.income} type="income" index={0} />
          <StatCard label="Total Expenses" value={stats.expense} type="expense" index={1} />
          <StatCard label="Net Balance" value={stats.balance} type="balance" index={2} />
        </div>

        <Chart transactions={filteredTransactions} />

        <div className="main-grid">
          <TransactionList
            transactions={filteredTransactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>

        <DataControls
          transactions={transactions}
          onImport={handleImport}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}

export default App;
