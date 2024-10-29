import './App.css'
import { useState, useEffect } from 'react'
function Transactions() {
    const [expense, setExpense] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])
  const [income, setIncome] = useState()
  const [category, setCategory] = useState('')
  // const [id, setId] = useState('');
  //   const [redirect,setRedirect] = useState(false)
  const options =["Education","Groceries","Health","clothing","Travelling","Food","Other"]
  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions'
      const response = await fetch(url, {
        method: 'GET',
        credentials:'include'
      });
      if (response.status === 401) {
        return 'unautho'
      }
 return await response.json()
    }
    getTransactions().then(transactions => {
      
      
        setTransactions(transactions)
      
     
    })
  }
      , [])
     async function transactionHandler(ev) {
        ev.preventDefault()
        const url = import.meta.env.VITE_API_URL + '/transaction'
        // const price = name.split(' ')[0]
       const response= await fetch(url, {
          method: "POST",
          headers: { 'Content-type': 'application/json'},
          body: JSON.stringify({
            income,
            expense,
            datetime,
            category,
            description,
          }),
          credentials: 'include', 
       })
       const newTransaction = await response.json();

          setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
       setIncome('')
       setExpense('')
       setCategory('')
        setDescription('')
        setDatetime('')
        // if (response.ok) {
        //   setRedirect(true)
        // }
      }
  function handleChange(ev) {
    setCategory(ev.target.value)
  }
  
  function deleteTransaction(id) {
    const url = import.meta.env.VITE_API_URL + `/transaction/${id}`
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include'
    })
    
  }
  // let balance = 0;
  // for (const transaction of transactions) {
    
  //   balance = transaction.income-transaction.expense
    
  // }
  
  return (
    <div>
      
        <main>
          <h1>${ }<span></span></h1>
        
          <form onSubmit={transactionHandler}>
            <div className="basic">
              <input type='text' placeholder='Total income' value={income} onChange={ev => setIncome(ev.target.value)} />
              <input type="text" placeholder="expense-amount" value={expense} onChange={ev => setExpense(ev.target.value)} />
              <input type="datetime-local" value={datetime} onChange={ev => setDatetime(ev.target.value)} />
              <label>Type:</label>
              <select style={{ color: 'black' }} onChange={handleChange}>
                {options.map((option, i) => (
                  <option value={option} key={i}>{option}</option>
                
                ))}
              </select>
            </div>
            <div className="description">

              <input type="text" placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)} />
            </div>
            <button type="submit">Add new transaction</button>
            <div className="transactions">
              {transactions.length > 0 ? transactions.map((transaction,) => (
                <div className="transaction" key={transaction._id}>
                  <div className="left">
                 
                    <div className="name">Type: {transaction.category}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>${transaction.expense}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 24 24" style={{ backgroundColor: 'white' }} onClick={() => deleteTransaction(transaction._id)}>
                        <path d="M3 3H21V5H3z"></path><path d="M16.1,22H7.9c-1,0-1.9-0.7-2-1.7L4,4.1l2-0.2L7.9,20l8.2,0L18,3.9l2,0.2l-1.9,16.1C18,21.3,17.1,22,16.1,22z"></path><path d="M5,4l1.9,16.1c0.1,0.5,0.5,0.9,1,0.9h8.2 c0.5,0,0.9-0.4,1-0.9L19,4H5z" opacity=".3"></path><path d="M15 3L15 4 9 4 9 3 10 2 14 2z"></path>
                      </svg>
                    </div>
                    <div className="datetime">{transaction.datetime}</div>
                  </div>
                </div>
              
              )):''}
            </div>
          </form>
        </main>

    </div>
  )
}

export default Transactions