import { useEffect } from "react"
import { UserContext } from "./UserContext"
import { useContext } from "react"
function Profile() {
    const{userInfo,setUserInfo} = useContext(UserContext)
    useEffect(() => {
        const url = import.meta.env.VITE_API_URL + '/profile'
      
        try {
         fetch(url, {
             'method':'GET',
            'credentials':'include'
         }).then((res) => res.json())
             .then((info) => {
                
                setUserInfo(info)
             })
        }
        catch (err) {
          console.error(err)
        }
    },[setUserInfo])
    let username = userInfo?.
        email ? userInfo.email.split('@')[0] : ''
  return (
      <div>Hiii,{username}</div>
  )
}

export default Profile
