import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from './Store/Slices/expenseSlice';
import { updateIncomeLocal } from './Store/Slices/authSlice';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaTag, FaAlignLeft, FaRupeeSign, FaList } from 'react-icons/fa';
import './AddTransaction.css';

const AddTransaction = () => {
  const dispatch = useDispatch();
  const { income, user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.expenses);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 16), // Current date and time in local timezone
    type: 'expense' // 'expense' or 'income'
  });
  
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
    
    setError('');
    
    try {
      // Prepare the transaction data
      const transactionData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || '',
        date: new Date(formData.date).toISOString(),
        expense: formData.type === 'expense' // true for expense, false for income
      };
      
      // Dispatch the action to add the expense using Redux
      const result = await dispatch(addExpense(transactionData));
      
      if (result.error) {
        throw new Error(result.payload || 'Failed to save transaction');
      }
      
      // Update income if needed (for tracking purposes)
      if (formData.type === 'income') {
        const newIncome = income + parseFloat(formData.amount);
        dispatch(updateIncomeLocal(newIncome));
      }
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        type: 'expense'
      });
      
      // Navigate to transactions list
      navigate('/transactions');
      
    } catch (err) {
      setError(err.message || 'Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    }
  };

  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="add-transaction-container">
      <header className="transaction-header">
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
            
            <div className="form-group amount-group">
              <span className="currency-symbol">₹</span>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                className="amount-input"
                required
              />
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaTag className="input-icon" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaAlignLeft className="input-icon" />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description (optional)"
                  className="form-control"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;