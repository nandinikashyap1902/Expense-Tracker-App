import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import Layout from './Layout';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // DELETE handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      const updatedTransactions = transactions.filter(t => t._id !== id);
      setTransactions(updatedTransactions);
    } catch (err) {
      console.error('Delete error:', err);
      // alert('Failed to delete: ' + err.message);
    }
  };

  // Filtering Logic
  useEffect(() => {
    let result = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term) ||
          t.amount.toString().includes(term)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type); // Fixed: using t.type now
    }

    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'amount': comparison = a.amount - b.amount; break;
        case 'date': comparison = new Date(a.datetime) - new Date(b.datetime); break;
        case 'category': comparison = (a.category || '').localeCompare(b.category || ''); break;
        default: break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filters]);

  const categories = ['all', ...new Set(transactions.map((t) => t.category).filter(Boolean))];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const toggleSortOrder = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  if (loading) return <Layout><div className="loading-container"><div className="spinner"></div></div></Layout>;

  return (
    <Layout>
      <div className="transactions-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: '700' }}>Transaction History</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>View and manage your financial records</p>
        </div>
        <button
          className="add-transaction-btn"
          onClick={() => navigate('/add-new-expense')}
          style={{
            backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem',
            borderRadius: '12px', border: 'none', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}
        >
          <FaPlus /> Add New
        </button>
      </div>

      <div className="filters-container" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <div className="search-box" style={{ marginBottom: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px',
                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', flex: 1 }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', flex: 1 }}
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

      <div className="transactions-list" style={{ background: 'white', borderRadius: '20px', padding: '0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div className="transactions-header-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#64748b' }}>
          <div onClick={() => toggleSortOrder('date')} style={{ cursor: 'pointer' }}>Date {getSortIcon('date')}</div>
          <div onClick={() => toggleSortOrder('description')} style={{ cursor: 'pointer' }}>Description {getSortIcon('description')}</div>
          <div onClick={() => toggleSortOrder('category')} style={{ cursor: 'pointer' }}>Category {getSortIcon('category')}</div>
          <div onClick={() => toggleSortOrder('amount')} style={{ cursor: 'pointer', textAlign: 'right' }}>Amount {getSortIcon('amount')}</div>
          <div style={{ textAlign: 'center' }}>Actions</div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="no-transactions" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className={`transaction-row`}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}
            >
              <div className="transaction-cell date" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {formatDate(transaction.datetime)}
              </div>
              <div className="transaction-cell description" style={{ fontWeight: 500, color: '#1e293b' }}>
                {transaction.description || 'No description'}
              </div>
              <div className="transaction-cell category">
                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', color: '#475569' }}>
                  {transaction.category || 'Uncategorized'}
                </span>
              </div>
              <div className="transaction-cell amount" style={{ textAlign: 'right' }}>
                <span style={{
                  fontWeight: 600,
                  color: transaction.type === 'expense' ? '#dc2626' : '#16a34a',
                  background: transaction.type === 'expense' ? '#fee2e2' : '#dcfce7',
                  padding: '0.25rem 0.75rem', borderRadius: '8px'
                }}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  ₹{Number(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="transaction-cell actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate(`/edit-transaction/${transaction._id}`)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}
                  className="hover:bg-slate-100" // You might need Tailwind or custom CSS class for hover
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default AllTransactions;
