import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaAlignLeft, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import Layout from './Layout';
import './AddTransaction.css';

const AddTransaction = () => {
  const { income } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    type: 'expense'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate Real Balance
  const [activeBalance, setActiveBalance] = useState(income);

  const categories = [
    { value: 'Food', label: 'Food', icon: '🍔' },
    { value: 'Transportation', label: 'Transportation', icon: '🚗' },
    { value: 'Housing', label: 'Housing', icon: '🏠' },
    { value: 'Utilities', label: 'Utilities', icon: '💡' },
    { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Personal', label: 'Personal', icon: '👤' },
    { value: 'Other', label: 'Other', icon: '📌' },
  ];

  // Fetch transactions to calculate real balance
  React.useEffect(() => {
    async function fetchBalance() {
      try {
        const url = import.meta.env.VITE_API_URL + '/transactions';
        const response = await fetch(url, { credentials: 'include' });
        if (response.ok) {
          const txns = await response.json();
          let totalExp = 0;
          let totalInc = 0;
          txns.forEach(t => {
            const amt = parseFloat(t.amount);
            if (t.type === 'expense') totalExp += amt;
            else if (t.type === 'income') totalInc += amt;
            else if (amt > 0) totalExp += amt; // Fallback
          });
          setActiveBalance((income || 0) + totalInc - totalExp);
        }
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    }
    fetchBalance();
  }, [income]);

  // Update active balance immediately after adding a transaction (optimistic update)
  const updateBalanceLocally = (newTxn) => {
    setActiveBalance(prev => {
      const amt = parseFloat(newTxn.amount);
      if (newTxn.type === 'expense') return prev - amt;
      return prev + amt;
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || '',
        datetime: new Date(formData.date).toISOString(),
        type: formData.type
      };

      const url = import.meta.env.VITE_API_URL + '/transaction'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      const savedTransaction = await response.json();
      updateBalanceLocally(savedTransaction);

      // Reset
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        type: 'expense'
      });

      // Optional: navigate back or show success toast
      alert('Transaction Added Successfully!');

    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="header-section" style={{ marginBottom: '1rem' }}>
          <div className="header-title">
            <h1 style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: '700' }}>Add Transaction</h1>
          </div>
        </div>

        <div className="balance-card" style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
          color: 'white', padding: '1.5rem', borderRadius: '20px',
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)', marginBottom: '2rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Current Active Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            ₹{activeBalance !== undefined && activeBalance !== null ? activeBalance.toFixed(2) : '0.00'}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div className="form-group type-toggle" style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                background: formData.type === 'expense' ? 'white' : 'transparent',
                color: formData.type === 'expense' ? '#dc2626' : '#64748b',
                boxShadow: formData.type === 'expense' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                background: formData.type === 'income' ? 'white' : 'transparent',
                color: formData.type === 'income' ? '#16a34a' : '#64748b',
                boxShadow: formData.type === 'income' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Income
            </button>
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#64748b' }}>₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', background: 'white' }}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a note..."
              rows="3"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '1rem', background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1, transition: 'background 0.2s'
            }}
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddTransaction;
