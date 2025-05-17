import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './App.css'; // Ensure this has your global styles

const Transactions = () => {
  const { userInfo,income,setIncome} = useContext(UserContext);
   //const [Newincome, setNewIncome] = useState(0);
  const [expense, setExpense] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const options =["Education","Groceries","Health","clothing","Travelling","Food","Other"]

  function handleChange(ev) {
    setCategory(ev.target.value)
  }

  // Update income when a new expense is added
  const handleAddExpense = (e) => {
    e.preventDefault();
    const expenseValue = parseFloat(expense);
    if (!isNaN(expenseValue) && expenseValue > 0) {
      setTransactions([...transactions, { amount: expenseValue, type: 'expense' }]);
      setIncome(prev => prev - expenseValue); // Deduct expense
      setExpense('');
    }
  };
{transactions.map((transaction, index) => (
  console.log(transaction)
))}
  return (
    <div className="transactions-container">
      <main>
        <h1 className="balance-header">
          Total Balance: <span className="balance-amount">₹{income}</span>
        </h1>
        <form className="transaction-form" onSubmit={handleAddExpense}>
          <input
            className="input-field"
            placeholder="Expense amount"
            value={expense}
            onChange={e => setExpense(e.target.value)}
            type="number"
            min="0"
            required
          />
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
            <input type="text" placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)} />

          <button className="primary-btn" type="submit">Add Expense</button>
        </form>
        
        <section className="transactions-list-section">
          <h2>Transaction History</h2>
         <ul className="transactions-list">
           {transactions.map((tx, idx) => (
             <li key={idx} className="transaction-card">
               <div className="transaction-details">
                 <span className={tx.type === 'expense' ? 'expense' : 'income'}>
                   {tx.type === 'expense' ? '-' : '+'}₹{tx.amount}
                 </span>
                 <span>{tx.category}</span>
                 <span>{tx.description}</span>
                 <span>{tx.datetime}</span>
               </div>
               <div className="transaction-actions">
                 <button className="primary-btn">Edit</button>
                 <button className="primary-btn delete-btn">Delete</button>
               </div>
             </li>
           ))}
         </ul>
        </section>
      </main>
    </div>
  );
};

export default Transactions;