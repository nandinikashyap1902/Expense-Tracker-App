import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from './Store/Slices/expenseSlice';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './AllTransactions.css';

const AllTransactions = () => {
  // Get transactions from Redux store
  const dispatch = useDispatch();
  const { items: transactions, isLoading: loading, error: fetchError } = useSelector(state => state.expenses);
  const { user } = useSelector(state => state.auth);
  
  // Local state for UI management
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'income', 'expense'
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const navigate = useNavigate();

  // Fetch transactions using Redux action
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Apply filters and sorting when transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      applyFiltersAndSearch();
    }
  }, [transactions, searchTerm, filters]);

  // Apply filters and sorting
  const applyFiltersAndSearch = () => {
    let result = [...transactions];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      if (filters.type === 'income') {
        result = result.filter((t) => !t.expense);
      } else {
        result = result.filter((t) => t.expense);
      }
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      // Handle different sort fields
      switch (filters.sortBy) {
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'category':
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
          break;
        case 'date':
        default:
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
      }
      
      // Apply sort order
      if (filters.sortOrder === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    setFilteredTransactions(result);
  };

  // Handle delete transaction using Redux action
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await dispatch(deleteExpense(id));
      // The list will update automatically via the useEffect that depends on transactions
    }
  };

  // Get all available categories from transactions
  const getCategories = () => {
    const categories = transactions.map((t) => t.category);
    return ['all', ...new Set(categories)];
  };
  
  // Handle sort change
  const handleSortChange = (sortBy) => {
    if (filters.sortBy === sortBy) {
      // Toggle sort order if clicking the same column
      setFilters({
        ...filters,
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new sort column with default desc order
      setFilters({
        ...filters,
        sortBy,
        sortOrder: 'desc',
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Display loading spinner
  if (loading) {
    return (
      <div className="transactions-container loading-container">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  // Display error message
  if (fetchError) {
    return (
      <div className="transactions-container error-container">
        <p className="error-message">Error: {fetchError}</p>
        <button className="retry-button" onClick={() => dispatch(fetchExpenses())}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>All Transactions</h1>
        <button className="add-transaction-btn" onClick={() => navigate('/add-new-expense')}>
          <FaPlus /> Add New
        </button>
      </div>

      <div className="transactions-controls">
        {/* Search */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter controls */}
        <div className="filter-container">
          <div className="filter-group">
            <label>
              <FaFilter /> Type:
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              <FaFilter /> Category:
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                {getCategories().map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found. Add a new transaction or adjust your filters.</p>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('date')} className="sortable-header">
                  Date
                  {filters.sortBy === 'date' && (
                    filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                  )}
                </th>
                <th>Description</th>
                <th onClick={() => handleSortChange('category')} className="sortable-header">
                  Category
                  {filters.sortBy === 'category' && (
                    filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                  )}
                </th>
                <th onClick={() => handleSortChange('amount')} className="sortable-header">
                  Amount
                  {filters.sortBy === 'amount' && (
                    filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                  )}
                </th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className={transaction.expense ? 'expense-row' : 'income-row'}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className="amount-cell">₹{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.expense ? 'Expense' : 'Income'}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/edit-transaction/${transaction._id}`)}
                      className="edit-btn"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      className="delete-btn"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;
