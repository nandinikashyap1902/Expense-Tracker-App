import { useEffect } from "react"
import { UserContext } from "./UserContext"
import { useContext } from "react"
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
    return (
        <>
           {username ? (
                <div>
                    Hiii, {username} <button>Logout</button>
                </div>
            ) : (
                <div>Login</div>
            )}
        </>
  )
}

export default Profile
