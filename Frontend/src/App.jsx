import './App.css'
import { Route,Routes } from 'react-router-dom'
import Transaction from './Transaction'
import Transactions from './Transactions'
import Header from './Header'
import SignUp from './SignUp'
import SignIn from './SignIn'
// import Logout from './Logout'
import { UserContextProvider } from './UserContext'
import EditTransaction from './EditTransaction'
import { useContext } from 'react'
import Profile from './Profile'
import { UserContext } from './UserContext'
import { Link } from 'react-router-dom'
function App() {
  
  return (
    
      <UserContextProvider>
        
      <Routes>
      
        <Route path="/" element={<Transaction />} />
        <Route path='/add-new-expense' element={<Transactions />} />
        <Route path="/header" element={<Header />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        {/* <Route path='/logout' element={<Logout/>}></Route> */}
        <Route path='/edit-transaction/:id' element={<EditTransaction/>}></Route>
      </Routes>
</UserContextProvider>
      
    
  )
}

export default App
