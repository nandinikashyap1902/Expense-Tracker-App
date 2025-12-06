import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Layout from './Layout';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
    type: 'expense'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Fetch transaction details
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/${id}`);
        if (!response.ok) throw new Error('Failed to fetch transaction');

        const data = await response.json();
        setFormData({
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.datetime.slice(0, 16), // Format for datetime-local
          type: data.type || (data.expense > 0 ? 'expense' : 'income') // fallback for legacy
        });
      } catch (err) {
        setError('Could not load transaction details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          amount: parseFloat(formData.amount),
          type: formData.type,
          category: formData.category,
          description: formData.description,
          datetime: new Date(formData.date).toISOString()
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update transaction');

      navigate('/transactions'); // Go back to history
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Layout><div className="loading-container"><div className="spinner"></div></div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="header-section" style={{ marginBottom: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginRight: '1rem'
            }}
          >
            <FaArrowLeft /> Back
          </button>
          <div className="header-title">
            <h1 style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: '700' }}>Edit Transaction</h1>
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
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditTransaction;