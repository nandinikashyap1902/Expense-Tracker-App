import './App.css'
function App() {
  

  return (
    <>
      <main>
        <h1>$500<span>.00</span></h1>
        <form>
          <div className="basic">

          <input type="text" placeholder="iphone 13 pro" />
          <input type="datetime-local"/>
          </div>
          <div className="description">

          <input type="text" placeholder="description"/>
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
              <div className="price">$800</div>
              <div className="datetime">2024-10-12 17:30</div>
            </div>
          </div>
        </div>
     </main>
       
    </>
  )
}

export default App
