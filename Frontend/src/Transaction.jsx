// import { Link } from 'react-router-dom'
import './App.css'
 import { Navigate,Link } from 'react-router-dom'

import { useState, useEffect,useContext } from 'react'
import { UserContext } from './UserContext'
import { Chart } from './Chart'
import SignIn from './SignIn';
//import Profile from './Profile'

// import Profile from './Profile'
function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [showExpenseForm, setExpenseForm] = useState(false)
  // const { userInfo } = useContext(UserContext)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const { income, setIncome } = useContext(UserContext)
  
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL + '/profile'
    try {
        fetch(url, {
            'method': 'GET',
            'credentials': 'include',
               
        })
            .then((res) => res.json())
            .then((info) => {
                   if(info){

                     setUserInfo(info)
                   console.log(info)
                   }
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
      if (Array.isArray(transactions)) {
        setTransactions(transactions);
      } else {
        setTransactions([]);
      }
    })
   
  }
    , [setTransactions])
  let expenses = 0;
  let leftBalance = Number(income);
  for (const transaction of transactions) {
    expenses += transaction.expense
    if (leftBalance < 0) {
      
      leftBalance -= transaction.expense
    }
    else {
      leftBalance += transaction.expense
    }
  }
  
  
  // let income = 10000;
  function addNewExpense() {
    setExpenseForm(true)
  }
  if (showExpenseForm) {
    return (
      <Navigate to="/add-new-expense" />
    )
  }
  
// let username = userInfo?.
//     email ? userInfo.email.split('@')[0] : ''
  
  //   function logoutUser() {
  //       const url = import.meta.env.VITE_API_URL + '/logout'
  //    fetch(url, {
  //         method: 'POST',
  //         credentials: 'include'
  //     }).then((res) => {
  //       if (res.ok) {
  //         setUserInfo(null)
  //       }
  //     })
        
  // }
//   useEffect(()=>{
// setIncome()
//   },[])
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
    <main>
     
      
      <div className='expense-items'>
        {/* {userInfo === null ? <div>pls <Link to="/signin">SignIn</Link> to create transactions</div>: */}
       
          
          {/* <Profile/> */}
          {userInfo?.email?(
          <div className="card profile-card">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          {userInfo?.email?userInfo.email.charAt(0).toUpperCase() : "U"}
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: "0.95rem",
            wordBreak: "breakword",
            textAlign: "center",
          }}
        >
          {userInfo.email}
        </div>
        <button
          className="action-button profile-logout-btn"
          style={{
            width: "100%",
            fontSize: "0.95rem",
            padding: "0.4rem 0.5rem",
          }}
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </div>)
          :null}
         
       
      {/* } */}
        <div className='transactions-page'>
          
          {/* <h1>All transactions</h1> */}
       
            
{/* <label>Income:₹</label> */}
            {/* <input  placeholder='total-income' value={income} onChange={(ev) => setIncome(ev.target.value)}
              style={{color:'black'}} />
             */}
            
          {/* <div className='transactions-history'> */}
              <div className='expense-graph'>
                <h1 style={{textAlign:'center',fontWeight:'bold',fontSize:'2.5rem'}}>Expense-Chart</h1>
                <Chart></Chart>
            </div>
            {/* </div> */}
            <div className='recent-expenses'>
              <h4 style={{textAlign:'center',fontWeight:'bold',fontSize:'1.5rem'}}>Recent Transsactions</h4>
              {transactions.length<0?<div>No transactions found</div>:
<button style={{ backgroundColor: 'grey' }} onClick={addNewExpense}>Add new transaction</button>
}
              {/* <div className="transactions">
                
                {Array.isArray(transactions) && transactions.length > 0 ? transactions.map((transaction) => (
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
                )) : ''}
              </div> */}
            </div>
        
          <div className="balance-display">
            Balance: ₹{leftBalance}
          </div>
          <div className="transactions-list">
            {transactions.map(txn => (
              <div key={txn._id} className={`transaction-item ${txn.expense > 0 ? 'expense' : 'income'}`}>
                <div>
                  <div>{txn.description}</div>
                  <div style={{ fontWeight: 600, color: txn.expense > 0 ? 'var(--accent)' : 'var(--primary)' }}>
                    ₹{txn.expense}
                  </div>
                </div>
                <div>
                  <button className="action-button" onClick={() => handleEdit(txn._id)}>Edit</button>
                  <button className="action-button" onClick={() => handleDelete(txn._id)} style={{ background: 'var(--accent)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        
    </main>
  )
}

export default Transaction