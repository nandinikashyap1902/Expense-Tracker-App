import { useEffect } from "react"
import { UserContext } from "./UserContext"
import { useContext } from "react"
import { Link } from "react-router-dom"
function Profile() {
    const { userInfo, setUserInfo } = useContext(UserContext)
    useEffect(() => {
        const url = import.meta.env.VITE_API_URL + '/profile'
        try {
            fetch(url, {
                'method': 'GET',
                'credentials': 'include',
                   
            })
                .then((res) => res.json())
                .then((info) => {
                       if(info)
                        setUserInfo(info)
                       else {
                           setUserInfo(null)
                    }
                })
      }
       
   
            catch(err) {
                
                return err
            }
       
    }
      
     
    ,[setUserInfo])
    let username = userInfo?.
        email ? userInfo.email.split('@')[0] : ''
        function logoutUser() {
            const url = import.meta.env.VITE_API_URL + '/logout'
         fetch(url, {
              method: 'POST',
              credentials: 'include'
          }).then((res) => {
            if (res.ok) {
              setUserInfo(null)
            }
          })
            
        }
    return (
        <>
           {username ? (
                <div>
                    Hiii, {username} <button onClick={logoutUser}>Logout</button>
                </div>
            ) : (
                <Link to="/signin"></Link>
            )}
        </>
  )
}

export default Profile
