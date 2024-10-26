// import { Link } from 'react-router-dom'
import './App.css'

// import { Navigate } from 'react-router-dom'

import { useState, useEffect } from 'react'
function Transaction() {
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions'
      const response = await fetch(url);
      return await response.json()
    }
    getTransactions().then(transactions => {
      setTransactions(transactions)
    })
  }
      , [])
  return (
    <>
      <div className='expense-items'>
        <div className='menu-items'>
          <div className='profile'>Profile</div>
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
          <div className='transactions-history'>
          <div className='expense-graph'>expense-graph</div>
            <div className='recent-expenses'> 
            <div className="transactions">
            {transactions.length > 0 && transactions.map((transaction,) => (
               <div className="transaction" key={transaction._id}>
            <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{ transaction.description}</div>
            </div>
            <div className="right">
                  <div className={"price " +(transaction.price<0?'red':'green')}>${transaction.price}</div>
                  <div className="datetime">{transaction.datetime}</div>
            </div>
                </div>
              
          ))}
          </div>
</div>
          </div>
          <div className='income-items'>
            <div className='total-income'>total-income</div>
            <div className='total-expense'>total-expense</div>
            <div className="balance">balance</div>
         </div>
        </div>
        </div>
      </>
  )
}

export default Transaction