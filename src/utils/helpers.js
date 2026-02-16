// curr/money
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// get** last n days
export const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(formatDateKey(date));
  }
  return days;
};

// Return local YYYY-MM-DD for a Date
export const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// again, transac time periods
export const filterTransactionsByPeriod = (transactions, period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'daily': {
      const todayStr = formatDateKey(today);
      return transactions.filter((t) => {
        try {
          const tDateStr = formatDateKey(new Date(t.date));
          return tDateStr === todayStr;
        } catch (e) {
          return false;
        }
      });
    }
    
    case 'weekly': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= weekAgo && tDate <= now;
      });
    }
    
    case 'monthly': {
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= monthAgo && tDate <= now;
      });
    }
    
    case 'yearly': {
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= yearAgo && tDate <= now;
      });
    }
    
    case 'all':
    default:
      return transactions;
  }
};

// Calc. stats
export const calculateStats = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
};

// get8 chart data - time period
export const getChartData = (transactions, period) => {
  let dateRange = [];
  let groupBy = 'day';

  switch (period) {
    case 'daily': {
      // 24 hours by hour
      dateRange = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (23 - i));
        return hour;
      });
      groupBy = 'hour';
      break;
    }
    
    case 'weekly': {
      // 7 days
      dateRange = getLastNDays(7).map(d => new Date(d));
      groupBy = 'day';
      break;
    }
    
    case 'monthly': {
      // 30 days
      dateRange = getLastNDays(30).map(d => new Date(d));
      groupBy = 'day';
      break;
    }
    
    case 'yearly': {
      // 12 months
      dateRange = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - (11 - i));
        return month;
      });
      groupBy = 'month';
      break;
    }
    
    case 'all':
    default: {
      // 7 days as default
      dateRange = getLastNDays(7).map(d => new Date(d));
      groupBy = 'day';
      break;
    }
  }

  return dateRange.map((date) => {
    let label = '';
    let filterFn;

    if (groupBy === 'hour') {
      label = date.toLocaleTimeString('en-US', { hour: 'numeric' });
      const hourStr = formatDateKey(date);
      const hour = date.getHours();
      filterFn = (t) => {
        try {
          const tDate = new Date(t.date);
          const tDateStr = formatDateKey(tDate);
          return tDateStr === hourStr && tDate.getHours() === hour;
        } catch (e) {
          return false;
        }
      };
    } else if (groupBy === 'month') {
      label = date.toLocaleDateString('en-US', { month: 'short' });
      filterFn = (t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      };
    } else {
      label = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = formatDateKey(date);
      filterFn = (t) => {
        try {
          return formatDateKey(new Date(t.date)) === dateStr;
        } catch (e) {
          return false;
        }
      };
    }

    const dayTransactions = transactions.filter(filterFn);
    const income = dayTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: date.toISOString().split('T')[0],
      day: label,
      income,
      expense,
    };
  });
};

// ctgry. mappings
export const CATEGORIES = {
  income: [
    { value: 'salary', label: 'Salary', icon: '💼' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'gift', label: 'Gift', icon: '🎁' },
    { value: 'other', label: 'Other', icon: '💰' },
  ],
  expense: [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'bills', label: 'Bills & Utilities', icon: '📄' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'other', label: 'Other', icon: '💰' },
  ],
};

// ctgry. icons
export const getCategoryIcon = (category, type) => {
  const categories = CATEGORIES[type];
  const found = categories.find((cat) => cat.value === category);
  return found ? found.icon : '💰';
};

// this part is sorting the transc.
export const sortTransactions = (transactions, sortBy) => {
  const sorted = [...transactions];
  
  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    default:
      return sorted;
  }
};

// search
export const searchTransactions = (transactions, query) => {
  if (!query) return transactions;
  
  const lowerQuery = query.toLowerCase();
  return transactions.filter((t) =>
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery)
  );
};

// exporting for json
export const exportToJSON = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finflow-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// export - csv 
export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    t.type,
    t.category,
    t.description,
    t.amount,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finflow-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// import
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          resolve(imported);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
