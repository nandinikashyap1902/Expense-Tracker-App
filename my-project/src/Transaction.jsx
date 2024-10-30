// import { Link } from 'react-router-dom'
import './App.css'
 import { Navigate } from 'react-router-dom'

import { useState, useEffect,useContext } from 'react'
import { UserContext } from './UserContext'
import Profile from './Profile'
function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [showExpenseForm,setExpenseForm] = useState(false)
  const{userInfo} = useContext(UserContext)
  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions'
      try {
        
        const response = await fetch(url, {
          method: 'GET',
          credentials:'include'
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
      balance+=transaction.price
    }
  balance = balance.toFixed(2)
  
  let income = 10000;
  function addNewExpense() {
    setExpenseForm(true)
  }
  if (showExpenseForm) {
    return (
      <Navigate to="/add-new-expense"/>
    )
  }
  return (
    <>
      <div className='expense-items'>
        <div className='menu-items'>
          <div className='profile'>Profile
           <Profile/>
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

          <button style={{backgroundColor:'grey'}} onClick={addNewExpense}>Add new transaction</button>
          </div>
          <div className='transactions-history'>
          <div className='expense-graph'>expense-graph</div>
            <div className='recent-expenses'> 
              <h4>Recent Transsactions</h4>
              <div className="transactions">
                
            {transactions.length > 0 && transactions.map((transaction,) => (
               <div className="transaction" key={transaction._id}>
            <div className="left">
                  <div className="name">{transaction.category}</div>
                  <div className="description">{ transaction.description}</div>
            </div>
            <div className="right">
                  <div className={"price " +(transaction.price<0?'red':'green')}>₹{transaction.expense}</div>
                  <div className="datetime">{transaction.datetime}</div>
            </div>
                </div>
              
          ))}
          </div>
</div>
          </div>
          <div className='income-items'>
            <div className='total-income'>₹{income}</div>
            <div className='total-expense'>total-expense</div>
            <div className="balance">₹{balance}</div>
         </div>
        </div>
        </div>
      </>
  )
}

export default Transaction