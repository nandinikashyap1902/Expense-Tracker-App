import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateExpense } from "./Store/Slices/expenseSlice";
import { FaArrowLeft, FaCalendarAlt, FaTag, FaAlignLeft, FaRupeeSign } from "react-icons/fa";
import './App.css';

function EditTransaction() {
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

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    expense: true // Default to expense type
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.expenses);
  
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const url = import.meta.env.VITE_API_URL + `/transactions/${id}`;
        const response = await fetch(url, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction');
        }
        
        const transactionInfo = await response.json();
        
        // Format the date from ISO string to datetime-local input format
        const date = new Date(transactionInfo.date);
        const formattedDate = date.toISOString().slice(0, 16);
        
        setFormData({
          _id: transactionInfo._id,
          amount: transactionInfo.amount,
          category: transactionInfo.category,
          description: transactionInfo.description || '',
          date: formattedDate,
          expense: transactionInfo.expense
        });
        
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Error fetching transaction');
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'expense') {
      setFormData(prev => ({
        ...prev,
        expense: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? value.replace(/\D/g, '') : value
      }));
    }
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
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };
      
      const result = await dispatch(updateExpense(transactionData));
      
      if (result.error) {
        throw new Error(result.payload || 'Failed to update transaction');
      }
      
      navigate('/transactions');
      
    } catch (err) {
      setError(err.message || 'Failed to update transaction. Please try again.');
    }
  };
  
  const handleBack = () => {
    navigate('/transactions');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transaction data...</p>
      </div>
    );
  }

  return (
    <div className="edit-transaction-container">
      <header className="transaction-header">
        <div className="header-left">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1>Edit Transaction</h1>
        </div>
      </header>
      
      <div className="transaction-content">
        <div className="transaction-card">
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group type-toggle">
              <label>Transaction Type:</label>
              <div className="toggle-switch">
                <input 
                  type="checkbox"
                  id="expense-toggle"
                  name="expense"
                  checked={formData.expense}
                  onChange={handleChange}
                />
                <label htmlFor="expense-toggle" className="toggle-label">
                  <span className={formData.expense ? 'active' : ''}>Expense</span>
                  <span className={!formData.expense ? 'active' : ''}>Income</span>
                </label>
              </div>
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
              className="submit-btn update-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTransaction;