import './App.css'
// import { useState, useEffect } from 'react'
// import { Navigate } from 'react-router-dom'
import { Route,Routes } from 'react-router-dom'
import Transaction from './Transaction'
function App() {
  // const [name, setName] = useState('')
  // const [datetime, setDatetime] = useState('')
  // const [description, setDescription] = useState('')
  // const [transactions, setTransactions] = useState('')
  // const [redirect,setRedirect] = useState(false)
  // useEffect(() => {
  //   async function getTransactions() {
  //     const url = import.meta.env.VITE_API_URL + '/transactions'
  //     const response = await fetch(url);
  //     return await response.json()
  //   }
  //   getTransactions().then(transactions => {
     
  //     setTransactions(transactions)
  //   })
  // }
  //  , [])
  
  
  // function transactionHandler(ev) {
  //   ev.preventDefault()
  //   const url = import.meta.env.VITE_API_URL + '/transaction'
  //   const price = name.split(' ')[0]
  //  const response= fetch(url, {
  //     method: "POST",
  //     headers: { 'Content-type': 'application/json'},
  //     body: JSON.stringify({
  //       price,
  //       name:name.substring(price.length+1),
  //       description,
  //       datetime
  //     }) }).then(res => {
  //         res.json()
  //     })
  //   setName('');
  //   setDescription('')
  //   setDatetime('')
  //   if (response.ok) {
  //     setRedirect(true)
  //   }
  // }
  // if (redirect) {
  //   return  <Navigate to={'/'} />
  //  }

  // let balance = 0;
  // for (const transaction of transactions) {
  //   balance+=transaction.price
  // }
  // balance = balance.toFixed(2)
  return (
    <>
      <Routes>
        <Route index element={ <Transaction/>} />
      </Routes>
    </>
  )
}

export default App
