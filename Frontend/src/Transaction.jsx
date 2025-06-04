import './App.css'
import { Navigate, Link } from 'react-router-dom'
import { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from './UserContext'
import { Chart } from './Chart'
import { FaBars, FaTimes, FaWallet, FaHistory } from 'react-icons/fa';
import './Sidebar.css' 
import { useNavigate } from 'react-router-dom'
function Transaction() {
  // All state declarations at the top
  const [transactions, setTransactions] = useState([]);
  const [showExpenseForm, setExpenseForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const { userInfo, income, setIncome ,setUserInfo} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
  
  
  // All hooks must be declared before any conditional returns
  
  // Toggle sidebar callback
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // Calculate totals callback
  const calculateTotals = useCallback(() => {
    if (!transactions.length) return { totalExpense: 0, totalIncome: 0 };
    
    return transactions.reduce((acc, txn) => {
      if (txn.expense > 0) {
        acc.totalExpense += txn.expense;
      } else {
        acc.totalIncome += Math.abs(txn.expense);
      }
      return acc;
    }, { totalExpense: 0, totalIncome: 0 });
  }, [transactions]);

  // Transactions fetching effect
  useEffect(() => {
    async function getTransactions() {
      setIsLoading(true);
      const url = import.meta.env.VITE_API_URL + '/transactions';
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.status === 401) {
          setTransactions([]);
          return null;
        }
        return await response.json();
      }
      catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]); // Set to empty array on error
        return null;
      }
      finally {
        setIsLoading(false);
      }
    }
    
    getTransactions().then(transactions => {
      if (Array.isArray(transactions)) {
        setTransactions(transactions);
      } else {
        setTransactions([]);
      }
    });
  }, []);

  // Derived values from state (not hooks, safe to put here)
  const { totalExpense, totalIncome } = calculateTotals();
  const balance = income - totalExpense;
  const recentTransactions = transactions.slice(0, 5);

  // Function declarations
  function addNewExpense() {
    setExpenseForm(true);
  }

  function logoutUser() {
    const url = import.meta.env.VITE_API_URL + '/logout';
    fetch(url, {
      method: 'POST',
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        setUserInfo(null);
      }
    });
    navigate('/signin');
  }

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
              <span className={balance >= 0 ? 'positive' : 'negative'}>
                ₹{Math.abs(balance)} {balance < 0 ? '(Overdraft)' : ''}
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
                      {txn.expense > 0 ? '-' : '+'}₹{Math.abs(txn.expense)}
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

  // if (!userInfo || !userInfo.email) {
  //   return <SignIn />;
  // }

  // Main component render
  return (
    <div className="app-container">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            {userInfo?.email ? userInfo.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-email">{userInfo.email}</div>
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
          <button onClick={logoutUser} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className='expense-items'>
          <div className='transactions-page'>
            <div className='expense-graph'>
              {/* <h1>Expense Chart</h1> */}
              <Chart transactions={transactions}/>
            </div>
          </div>
        </div>
      </main>
      
      {showExpenseForm && <Navigate to="/add-new-expense" />}
    </div>
  );
}

export default Transaction