import './App.css'
import { Navigate, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Chart } from './Chart'
import { FaBars, FaTimes, FaWallet, FaHistory } from 'react-icons/fa';
import './Sidebar.css' 
import { useNavigate } from 'react-router-dom'
import { FaList } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, calculateTotals } from './Store/Slices/expenseSlice';
import { logoutUser, updateIncomeLocal } from './Store/Slices/authSlice';

function Transaction() {
  // Redux hooks
  const dispatch = useDispatch();
  const { items: transactions, isLoading, totalIncome, totalExpense, balance } = useSelector(state => state.expenses);
  const { user, income, isAuthenticated } = useSelector(state => state.auth);
  
  // Local state
  const [showExpenseForm, setExpenseForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  
  const navigate = useNavigate();

  // Toggle sidebar callback
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // Fetch transactions using Redux
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Calculate totals using Redux
  useEffect(() => {
    if (transactions.length > 0) {
      dispatch(calculateTotals());
    }
  }, [transactions, dispatch]);

  // Derived values
  const recentTransactions = transactions.slice(0, 5);
  const reduxBalance = income - totalExpense;

  // Function declarations
  function addNewExpense() {
    setExpenseForm(true);
  }

  function handleLogout() {
    dispatch(logoutUser());
    // navigate('/signin');
  }

  // Function to update income (if needed in this component)
  const updateIncome = (newIncome) => {
    dispatch(updateIncomeLocal(newIncome));
  };

  // Sidebar content renderer
  const renderSidebarContent = () => {
    switch(activeTab) {
      case 'balance':
        return (
          <div className="balance-summary">
            <h3><FaWallet /> Balance Overview</h3>
            <div className="balance-item">
              <span>Income:</span>
              <span className="income-amount">₹{income}</span>
            </div>
            <div className="balance-item">
              <span>Expenses:</span>
              <span className="expense-amount">-₹{totalExpense}</span>
            </div>
            <div className="balance-total">
              <span>Available Balance:</span>
              <span className={reduxBalance >= 0 ? 'positive' : 'negative'}>
                ₹{Math.abs(reduxBalance)} {reduxBalance < 0 ? '(Overdraft)' : ''}
              </span>
            </div>
          </div>
        );
      case 'transactions':
      default:
        return (
          <div className="recent-transactions">
            <h3><FaHistory /> Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <ul>
                {recentTransactions.map(txn => (
                  <li key={txn._id} className="recent-txn-item">
                    <div className="txn-info">
                      <span className="txn-category">{txn.category}</span>
                      <span className="txn-desc">{txn.description}</span>
                    </div>
                    <span className={`txn-amount ${txn.expense > 0 ? 'expense' : 'income'}`}>
                      {txn.expense > 0 ? '-' : '+'}₹{Math.abs(txn.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-txns">No recent transactions</p>
            )}
          </div>
        );
    }
    
  };

  // Early returns - must come after all hooks and function declarations
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" />;
  // }

  // Main component render
  return (
    <div className="app-container">
      <header className="transaction-header">
        {/* Sidebar Toggle Button */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="user-avatar">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="user-email">{user?.email || 'Guest User'}</div>
          </div>
          
          <div className="sidebar-tabs">
            <button 
              className={activeTab === 'transactions' ? 'active' : ''}
              onClick={() => setActiveTab('transactions')}
            >
              <FaHistory /> Transactions
            </button>
            <button 
              className={activeTab === 'balance' ? 'active' : ''}
              onClick={() => setActiveTab('balance')}
            >
              <FaWallet /> Balance
            </button>
          </div>
          
          <div className="sidebar-content">
            {renderSidebarContent()}
          </div>
          <div className="sidebar-footer">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            ) : (
              <Link to="/signin" className="login-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* View All Transactions Button - Right Aligned */}
        <div style={{ 
          marginLeft: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          marginRight: '15px' 
        }}>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/transactions')}
            aria-label="View all transactions"
          >
            <FaList />
            <span className="btn-text">View All</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="expense-container">
          <div className="transactions-page">
            <div className="expense-graph">
              <Chart transactions={transactions} />
            </div>
          </div>
        </div>
      </main>
      
      {showExpenseForm && <Navigate to="/add-new-expense" />}
    </div>
  );
}

export default Transaction