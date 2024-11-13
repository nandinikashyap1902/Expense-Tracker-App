import { Link } from 'react-router-dom'
import './App.css'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from './UserContext'
function Transactions() {
  // const [expense, setExpense] = useState(0)
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])
  const { income } = useContext(UserContext)
 const [expense, setExpense]=useState(0)
  const [category, setCategory] = useState('')
  const [redirect,setredirect] = useState(false)
  // const [id, setId] = useState('');
  //   const [redirect,setRedirect] = useState(false)
  const options =["Education","Groceries","Health","clothing","Travelling","Food","Other"]
  useEffect(() => {
    async function getTransactions() {
      const url = import.meta.env.VITE_API_URL + '/transactions'
      try {
        
        const response = await fetch(url, {
          method: 'GET',
          credentials:'include'
        });
        if (response.status === 401) {
          setTransactions([]); // Set to empty array if unauthorized
          return null;
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
      if (transactions) setTransactions(transactions); // Update only if transactions data exists
    });
  }
      , [])
     async function transactionHandler(ev) {
       ev.preventDefault()
      
        const url = import.meta.env.VITE_API_URL + '/transaction'
        // const price = name.split(' ')[0]
       const response= await fetch(url, {
          method: "POST",
         headers: { 'Content-type': 'application/json' },
         credentials: 'include', 
          body: JSON.stringify({
            income,
            expense,
            datetime,
            category,
            description,
          }),
          
       })
       const newTransaction = await response.json();

          setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      //  setIncome('')
       setExpense('')
       setCategory('')
        setDescription('')
        setDatetime('')
       
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
    .then(() => {
     
      setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction._id !== id));
    });
  }
  
  let currentBalance = Number(income)
  for (const transaction of transactions) {
    if (transaction.expense < 0) {
      currentBalance -= Math.abs(transaction.expense); 
    } else {
      currentBalance += transaction.expense; 
    }
  }
  
  
  return (
    <div>
      
        <main>
          <h1>₹{currentBalance}<span></span></h1>
        
          <form onSubmit={transactionHandler}>
            <div className="basic">
              {/* <input type='text' placeholder='Total income' value={income} onChange={ev => setIncome(ev.target.value)} /> */}
              <input  placeholder="expense-amount" value={expense} onChange={ev => setExpense(ev.target.value)} />
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
                    <Link to={`/edit-transaction/${transaction._id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48" style={{ backgroundColor: 'white' }} >
<path fill="#E57373" d="M42.583,9.067l-3.651-3.65c-0.555-0.556-1.459-0.556-2.015,0l-1.718,1.72l5.664,5.664l1.72-1.718C43.139,10.526,43.139,9.625,42.583,9.067"></path><path fill="#FF9800" d="M4.465 21.524H40.471999999999994V29.535H4.465z" transform="rotate(134.999 22.469 25.53)"></path><path fill="#B0BEC5" d="M34.61 7.379H38.616V15.392H34.61z" transform="rotate(-45.02 36.61 11.385)"></path><path fill="#FFC107" d="M6.905 35.43L5 43 12.571 41.094z"></path><path fill="#37474F" d="M5.965 39.172L5 43 8.827 42.035z"></path>
</svg>
                    </Link>
                    <div className={"price " + (transaction.expense<0 ? 'red' : 'green')}>₹{transaction.expense}
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