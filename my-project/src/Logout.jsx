
import { Link } from 'react-router-dom'
import { useContext} from 'react'
import { UserContext } from './UserContext'
function Logout() {
   const{setUserInfo} = useContext(UserContext)
    function logoutUser() {
      const url = import.meta.env.VITE_API_URL + '/logout'
    const response=  fetch(url, {
        method: 'POST',
        credentials: 'include'
    })
      if (response.ok) {
        setUserInfo(null)
      }
  }
  
  return (
      <div>
          <Link><button onClick={logoutUser}>Logout</button></Link>
    </div>
  )
}

export default Logout