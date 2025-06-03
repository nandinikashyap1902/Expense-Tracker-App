import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './AllTransactions.css';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'income', 'expense'
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        // if (!token) {
        //   throw new Error('Authentication required');
        // }
        // method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        //   // Add authentication token if needed
        //   // 'Authorization': `Bearer ${userInfo?.token}`
        // },
        // body: JSON.stringify(transactionData),
        // credentials: 'include' // Include cookies if using session-based auth
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   credentials: 'include',
         method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (err) {
        setError(err.message || 'Error fetching transactions');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...transactions];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term) ||
          t.amount.toString().includes(term)
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.datetime) - new Date(b.datetime);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        default:
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filters]);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(transactions.map((t) => t.category).filter(Boolean))];

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Toggle sort order
  const toggleSortOrder = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }


  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transaction History</h1>
        <button 
          className="add-transaction-btn"
          onClick={() => navigate('/add-transaction')}
        >
          <FaPlus /> Add Transaction
        </button>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="transactions-list">
        <div className="transactions-header-row">
          <div 
            className="header-cell date" 
            onClick={() => toggleSortOrder('date')}
          >
            Date {getSortIcon('date')}
          </div>
          <div 
            className="header-cell description"
            onClick={() => toggleSortOrder('description')}
          >
            Description {getSortIcon('description')}
          </div>
          <div 
            className="header-cell category"
            onClick={() => toggleSortOrder('category')}
          >
            Category {getSortIcon('category')}
          </div>
          <div 
            className="header-cell amount"
            onClick={() => toggleSortOrder('amount')}
          >
            Amount {getSortIcon('amount')}
          </div>
          <div className="header-cell actions">Actions</div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found. Add a new transaction to get started!</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div 
              key={transaction._id} 
              className={`transaction-row ${transaction.type}`}
            >
              <div className="transaction-cell date">
                {formatDate(transaction.datetime)}
              </div>
              <div className="transaction-cell description">
                {transaction.description || 'No description'}
              </div>
              <div className="transaction-cell category">
                {transaction.category || 'Uncategorized'}
              </div>
              <div className="transaction-cell amount">
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="transaction-cell actions">
                <button 
                  className="icon-btn edit-btn" 
                  onClick={() => navigate(`/edit-transaction/${transaction._id}`)}
                  aria-label="Edit transaction"
                >
                  <FaEdit />
                </button>
                <button 
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(transaction._id)}
                  aria-label="Delete transaction"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="transactions-summary">
        <div className="summary-item">
          <span>Total Income:</span>
          <span className="amount income">
            ${filteredTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span>Total Expenses:</span>
          <span className="amount expense">
            -${filteredTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="summary-item total">
          <span>Net Total:</span>
          <span className={`amount ${
            filteredTransactions.reduce((sum, t) => 
              t.type === 'income' ? sum + t.amount : sum - t.amount, 0
            ) >= 0 ? 'income' : 'expense'
          }`}>
            {filteredTransactions.reduce((sum, t) => 
              t.type === 'income' ? sum + t.amount : sum - t.amount, 0
            ) >= 0 ? '+' : '-'}
            ${Math.abs(filteredTransactions.reduce((sum, t) => 
              t.type === 'income' ? sum + t.amount : sum - t.amount, 0
            )).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
