import './App.css'
import { useState } from 'react'
function App() {
  const [name, setName] = useState('')
  const [datetime, setDatetime] = useState('')
  const[description,setDescription]  = useState('')
  return (
    <>
      <main>
        <h1>$500<span>.00</span></h1>
        <form>
          <div className="basic">

            <input type="text" placeholder="iphone 13 pro" value={name} onChange={ev=>setName(ev.target.value)}/>
          <input type="datetime-local" value={datetime} onChange={ev=>setDatetime(ev.target.value)}/>
          </div>
          <div className="description">

          <input type="text" placeholder="description" value={description} onChange={ev=>setDescription(ev.target.value)}/>
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          <div className="transaction">
            <div className="left">
              <div className="name">New washing machine</div>
              <div className="description">it was time for new washing machine</div>
            </div>
            <div className="right">
              <div className="price red">-$800</div>
              <div className="datetime">2024-10-12 17:30</div>
            </div>
          </div>
          <div className="transaction">
            <div className="left">
              <div className="name">New washing machine</div>
              <div className="description">it was time for new washing machine</div>
            </div>
            <div className="right">
              <div className="price red">-$800</div>
              <div className="datetime">2024-10-12 17:30</div>
            </div>
          </div>
          <div className="transaction">
            <div className="left">
              <div className="name">New washing machine</div>
              <div className="description">it was time for new washing machine</div>
            </div>
            <div className="right">
              <div className="price green">+$800</div>
              <div className="datetime">2024-10-12 17:30</div>
            </div>
          </div>
        </div>
     </main>
       
    </>
  )
}

export default App
