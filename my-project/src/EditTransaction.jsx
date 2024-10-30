import { useEffect, useState } from "react"
import './App.css'
import { useParams } from "react-router-dom"
function EditTransaction() {
    const options = ["Education", "Groceries", "Health", "clothing", "Travelling", "Food", "Other"]
    const [category, setCategory] = useState('')
    const [expense, setExpense] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [income, setIncome] = useState()
  
    const {id} = useParams()
    useEffect(() => {
        const url = import.meta.env.VITE_API_URL + `/transaction/${id}`
        fetch(url, {
            method: 'GET'
            
        }).then((res) => {
                res.json()
            
            .then(transactionInfo => {
               
                setCategory(transactionInfo.category)
                setDatetime(transactionInfo.datetime)
                setDescription(transactionInfo.description)
                setExpense(transactionInfo.expense)
                setIncome(transactionInfo.income)
            })
        })
    },[id])
   
    function updateTransaction(ev) {
        ev.preventDefault();
        const url = import.meta.env.VITE_API_URL + '/transaction'

        fetch(url, {
            method: 'PUT',
            body:JSON.stringify({
                income,
                expense,
                datetime,
                category,
                description,
              }),
        })
    }
    function handleChange(ev) {
        setCategory(ev.target.value)
      }
      
  return (
      <div>
          <h1>${category }<span></span></h1>
        
        <form onSubmit={updateTransaction}>
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
                 
                  <div className="description">

              <input type="text" placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)} />
                  </div>
              </div>

                  <button type="submit">Edit transaction</button>
              </form>
    </div>
  )
}

export default EditTransaction