import { useEffect } from "react"
import { UserContext } from "./UserContext"
import { useContext } from "react"
function Profile() {
    const{userInfo,setUserInfo} = useContext(UserContext)
    useEffect(() => {
        const url = import.meta.env.VITE_API_URL + '/profile'
      
        try {
        const response=    fetch(url, {
                'method':'GET',
                'credentials': 'include',
               
            }).then((res) => res.json())
                .then((info) => {
                   
                   setUserInfo(info)
                })
            
                if (response.status === 401) {
                    // Redirect to login if unauthorized
                    return 'login'
                }
      }
      catch (err) {
        console.error("Failed to fetch profile:", err);
        
    }    
      
        
    },[setUserInfo])
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
