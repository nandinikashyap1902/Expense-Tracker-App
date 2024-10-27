
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from './UserContext'
function Logout() {
    const{userInfo} = useContext(UserContext)
    function logoutUser() {
    console.log('usercontext',userInfo)
}
  return (
      <div>
          <Link><button onClick={logoutUser}>Logout</button></Link>
    </div>
  )
}

export default Logout