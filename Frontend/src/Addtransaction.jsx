import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaTag, FaAlignLeft, FaRupeeSign, FaList } from 'react-icons/fa';
import './AddTransaction.css'; // We'll create this file

const AddTransaction = () => {
  const { userInfo, income, setIncome } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 16), // Current date and time in local timezone
    type: 'expense' // 'expense' or 'income'
  });
  
  const [transactions, setTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      // Prepare the transaction data
      const transactionData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || '',
        datetime: new Date(formData.date).toISOString(),
        type: formData.type
      };
      
      // Make API call to save the transaction
      // const url = import.meta.env.VITE_API_URL + '/signup'
      // const response = await fetch(url, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //         email: email,
      //         password: password,
      //         income: Number(income)
      //     })
      // });
      //transaction
      const url = import.meta.env.VITE_API_URL + '/transaction'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if needed
          // 'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(transactionData),
        credentials: 'include' // Include cookies if using session-based auth
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save transaction');
      }
      
      const savedTransaction = await response.json();
      
      // Update local state with the saved transaction
      setTransactions(prev => [savedTransaction, ...prev]);
      
      // Update balance based on transaction type
      const amount = parseFloat(formData.amount);
      setIncome(prev => formData.type === 'expense' ? prev - amount : prev + amount);
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        type: 'expense'
      });
      
      // Show success message or redirect if needed
      // navigate('/transactions'); // Uncomment to redirect after successful save
      
    } catch (err) {
      setError(err.message || 'Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    // Find the transaction to get its amount and type
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Update balance when deleting
    if (transaction.type === 'expense') {
      setIncome(prev => prev + transaction.amount);
    } else {
      setIncome(prev => prev - transaction.amount);
    }
    
    // Remove from transactions
    setTransactions(transactions.filter(t => t.id !== id));
  };
  const handleBack = () => {
    // Instead of using navigate(-1), explicitly navigate to the home page
    navigate('/');
  };
  return (
    <div className="add-transaction-container">
      <header className="transaction-header">
        <div className="header-left">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1>Add Transaction</h1>
        </div>
        <button 
          className="view-all-btn"
          onClick={() => navigate('/transactions')}
          aria-label="View all transactions"
        >
          <FaList />
          <span className="btn-text">View All</span>
        </button>
      </header>
      
      <div className="transaction-content">
        <div className="transaction-card">
          <div className="balance-card">
            <div className="balance-label">
              <FaRupeeSign className="input-icon" />
              Current Balance
            </div>
            <div className="balance-amount">₹{income}</div>
          </div>
          
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group type-toggle">
              <button
                type="button"
                className={`toggle-btn ${formData.type === 'expense' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              >
                Expense
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.type === 'income' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              >
                Income
              </button>
            </div>
            
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="amount" className="input-label">
                <FaRupeeSign className="input-icon" />
                Amount
              </label>
              <div className="amount-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  required
                  className="amount-input"
                  inputMode="decimal"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="input-label">
                <FaTag className="input-icon" />
                Category
              </label>
              <div className="select-wrapper">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="category-select"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="date" className="input-label">
                <FaCalendarAlt className="input-icon" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="datetime-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="input-label">
                <FaAlignLeft className="input-icon" />
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a note..."
                className="description-input"
                rows="3"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;