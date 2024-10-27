import './App.css'
import { Route,Routes } from 'react-router-dom'
import Transaction from './Transaction'
import Transactions from './Transactions'
import Header from './Header'
import SignUp from './SignUp'
import SignIn from './SignIn'
import Logout from './Logout'
import { UserContextProvider } from './UserContext'
function App() {
  return (
    
      <UserContextProvider>
        
   <Routes>
        <Route index element={<Transaction />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path="/header" element={<Header />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/logout' element={<Logout/>}></Route>
      </Routes>
</UserContextProvider>
      
    
  )
}

export default App
