// import { Link } from 'react-router-dom'
import './App.css'
import { Navigate, Link } from 'react-router-dom'
import { useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from './UserContext'
import { Chart } from './Chart'
import SignIn from './SignIn';
import { FaBars, FaTimes, FaWallet, FaHistory } from 'react-icons/fa';
import './Sidebar.css'; // We'll create this for sidebar styles

function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [showExpenseForm, setExpenseForm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('transactions')
  const { userInfo, setUserInfo, income, setIncome } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen)
  }, [isSidebarOpen])

  // In Transaction.jsx
 // In Transaction.jsx, update the useEffect for profile fetching
//  useEffect(() => {
//    const fetchProfile = async () => {
//      try {
//        const url = import.meta.env.VITE_API_URL + '/profile';
//        const response = await fetch(url, {
//          method: 'GET',
//          credentials: 'include'
//        });
 
//        if (response.status === 401) {
//          // If unauthorized, clear user info and redirect to signin
//          setUserInfo(null);
//          return;
//        }
 
//        const info = await response.json();
//        if (info) {
//          setUserInfo(info);
//          setIncome(info.income || 0);
//        }
//      } catch (err) {
//        console.error('Error fetching profile:', err);
//        setUserInfo(null);
//      }
//    };
 
//    fetchProfile();
//  }, [setUserInfo, setIncome]);
useEffect(() => {
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL + '/profile';
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.status === 401) {
        setUserInfo(null);
        setIsLoading(false);
        return;
      }

      const info = await response.json();
      if (info) {
        setUserInfo(info);
        setIncome(info.income || 0);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, [setUserInfo, setIncome]);

// Add a loading state at the top of your component return
if (isLoading) {
  return <div className="loading">Loading...</div>; // Add appropriate loading UI
}

  useEffect(() => {
    async function getTransactions() {
     // console.log(income)
      const url = import.meta.env.VITE_API_URL + '/transactions'
      try {
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.status === 401) {
          setTransactions([]);
         
        }
        return await response.json()
      }
      catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]); // Set to empty array on error
        return null;
      }
    }
    getTransactions().then(transactions => {
      if (Array.isArray(transactions)) {
        setTransactions(transactions);
      } else {
        setTransactions([]);
      }
    })
   
  }
    , [setTransactions])

  // Calculate total expenses and income
  const calculateTotals = useCallback(() => {
    if (!transactions.length) return { totalExpense: 0, totalIncome: 0 }
    
    return transactions.reduce((acc, txn) => {
      if (txn.expense > 0) {
        acc.totalExpense += txn.expense
      } else {
        acc.totalIncome += Math.abs(txn.expense)
      }
      return acc
    }, { totalExpense: 0, totalIncome: 0 })
  }, [transactions])

  const { totalExpense, totalIncome } = calculateTotals()
  const balance = income - totalExpense

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5)

  // Render sidebar content based on active tab
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
        )
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
        )
    }
  }

  function addNewExpense() {
    setExpenseForm(true)
  }

  function logoutUser() {
    const url = import.meta.env.VITE_API_URL + '/logout'
    fetch(url, {
      method: 'POST',
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        setUserInfo(null)
      }
    })
  }

  if (!userInfo || !userInfo.email) {
    return <SignIn />;
  }

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
              <h1>Expense Chart</h1>
              <Chart />
            </div>
            
            {/* <div className='transactions-container'>
              <div className="transactions-header">
                <h2>All Transactions</h2>
                <button onClick={addNewExpense} className="add-transaction-btn">
                  + Add Transaction
                </button>
              </div>
              
              <div className="transactions-list">
                {transactions.length > 0 ? (
                  transactions.map(txn => (
                    <div key={txn._id} className={`transaction-item ${txn.expense > 0 ? 'expense' : 'income'}`}>
                      <div className="txn-details">
                        <div className="txn-category">{txn.category}</div>
                        <div className="txn-description">{txn.description}</div>
                        <div className="txn-date">{new Date(txn.datetime).toLocaleDateString()}</div>
                      </div>
                      <div className="txn-amount">
                        <span>{txn.expense > 0 ? '-' : '+'}₹{Math.abs(txn.expense)}</span>
                        <div className="txn-actions">
                          <button className="edit-btn" onClick={() => handleEdit(txn._id)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(txn._id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-transactions">
                    <p>No transactions yet. Add your first transaction to get started!</p>
                    <button onClick={addNewExpense} className="primary-btn">
                      Add Transaction
                    </button>
                  </div>
                )}
              </div>
            </div> */}

          </div>
        </div>
      </main>
      
      {showExpenseForm && <Navigate to="/add-new-expense" />}
    </div>
  )
}

export default Transaction