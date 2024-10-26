import './App.css'
import { Route,Routes } from 'react-router-dom'
import Transaction from './Transaction'
import Transactions from './Transactions'
import Header from './Header'
import SignUp from './SignUp'
function App() {
  return (
    <>

   <Routes>
        <Route index element={<Transaction />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path="/header" element={<Header />}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
      </Routes>
      
    </>
  )
}

export default App
