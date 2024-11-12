// import { Link } from 'react-router-dom'
import './App.css'
 import { Navigate,Link } from 'react-router-dom'

import { useState, useEffect,useContext } from 'react'
import { UserContext } from './UserContext'
// import Profile from './Profile'
function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [showExpenseForm, setExpenseForm] = useState(false)
  // const { userInfo } = useContext(UserContext)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const { income, setIncome, expense } = useContext(UserContext)
  
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL + '/profile'
    try {
        fetch(url, {
            'method': 'GET',
            'credentials': 'include',
               
        })
            .then((res) => res.json())
            .then((info) => {
                   if(info)
                    setUserInfo(info)
                   else {
                       setUserInfo(null)
                }
            })
  }
        catch(err) {
            
            return err
        }
}
,[setUserInfo])
  useEffect(() => {
    async function getTransactions() {
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
      if (transactions) setTransactions(transactions);
    })
   
  }
    , [setTransactions])
  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price
  }
  balance = balance.toFixed(2)
  
  // let income = 10000;
  function addNewExpense() {
    setExpenseForm(true)
  }
  if (showExpenseForm) {
    return (
      <Navigate to="/add-new-expense" />
    )
  }
  
let username = userInfo?.
    email ? userInfo.email.split('@')[0] : ''
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
  console.log(expense)
  return (
    <>
      {userInfo === null ? <div>pls <Link to="/signin">SignIn</Link> to create transactions</div>:
      <div className='expense-items'>
        <div className='menu-items'>
          <div className='profile'>Profile
          {username ? (
                <div>
                    Hiii, {username} <button onClick={logoutUser}>Logout</button>
                </div>
            ) : (
                <Link to="/signin"></Link>
            )}
          </div>
          <div className='ul-items'>
            <ul>
              {/* <Link to="/"> <li>Home</li></Link> */}
              {/* <Link to="/expenses"><li>Expenses</li></Link> */}
            </ul>
          </div>
        </div>
      
        <div className='transactions-page'>
          <span>Welcome!</span>
          <h1>All transactions</h1>
          <div className='trans-btn'>

            <button style={{ backgroundColor: 'grey' }} onClick={addNewExpense}>Add new transaction</button>
            </div>
            
<label>Income:₹</label>
            <input  placeholder='total-income' value={income} onChange={(ev) => setIncome(ev.target.value)}
              style={{color:'black'}} />
            
            
          <div className='transactions-history'>
            <div className='expense-graph'>expense-graph</div>
            <div className='recent-expenses'>
              <h4>Recent Transsactions</h4>
              <div className="transactions">
                
                {transactions.length > 0 && transactions!==undefined ? transactions.map((transaction,) => (
                  <div className="transaction" key={transaction._id}>
                    <div className="left">
                      <div className="name">{transaction.category}</div>
                      <div className="description">{transaction.description}</div>
                    </div>
                    <div className="right">
                      <div className={"price " + (transaction.expense < 0 ? 'red' : 'green')}>₹{transaction.expense}</div>
                      <div className="datetime">{transaction.datetime}</div>
                    </div>
                  </div>
              
                )):''}
              </div>
            </div>
          </div>
          <div className='income-items'>
            <div className='total-income'> total income₹{income}</div>
              <div className='total-expense'>total-expense₹{expense}</div>
            <div className="balance">left balance₹{balance}</div>
          </div>
        </div>
      </div>
        }
    </>
  )
}

export default Transaction