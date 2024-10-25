import './App.css'
import { useState, useEffect } from 'react'
// import { Navigate } from 'react-router-dom'

function Transaction() {
    const [name, setName] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])
//   const [redirect,setRedirect] = useState(false)
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
     async function transactionHandler(ev) {
        ev.preventDefault()
        const url = import.meta.env.VITE_API_URL + '/transaction'
        const price = name.split(' ')[0]
       const response= await fetch(url, {
          method: "POST",
          headers: { 'Content-type': 'application/json'},
          body: JSON.stringify({
            price,
            name:name.substring(price.length+1),
            description,
            datetime
          })
       })
       const newTransaction = await response.json();

          setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        setName('');
        setDescription('')
        setDatetime('')
        // if (response.ok) {
        //   setRedirect(true)
        // }
      }
     
    let balance = 0;
  for (const transaction of transactions) {
    balance+=transaction.price
  }
  balance = balance.toFixed(2)
  return (
      <>
    <main>
        <h1>${balance}<span></span></h1>
        <form onSubmit={transactionHandler}>
          <div className="basic">

            <input type="text" placeholder="iphone 13 pro" value={name} onChange={ev=>setName(ev.target.value)}/>
          <input type="datetime-local" value={datetime} onChange={ev=>setDatetime(ev.target.value)}/>
          </div>
          <div className="description">

          <input type="text" placeholder="description" value={description} onChange={ev=>setDescription(ev.target.value)}/>
          </div>
          <button type="submit">Add new transaction</button>
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
        </form>
     </main>
      </>
  )
}

export default Transaction