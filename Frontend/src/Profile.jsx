// import { useEffect } from "react"
// import { UserContext } from "./UserContext"
// import { useContext } from "react"
// import { Link } from "react-router-dom"
// function Profile() {
//     const { userInfo, setUserInfo } = useContext(UserContext)
//     useEffect(() => {
//         const url = import.meta.env.VITE_API_URL + '/profile'
//         try {
//             fetch(url, {
//                 'method': 'GET',
//                 'credentials': 'include',
                   
//             })
//                 .then((res) => res.json())
//                 .then((info) => {
//                        if(info)
//                         setUserInfo(info)
//                        else {
//                            setUserInfo(null)
//                     }
//                 })
//       }
       
   
//             catch(err) {
                
//                 return err
//             }
       
//     }
      
     
//     ,[setUserInfo])
//     let username = userInfo?.
//         email ? userInfo.email.split('@')[0] : ''
//         function logoutUser() {
//             const url = import.meta.env.VITE_API_URL + '/logout'
//          fetch(url, {
//               method: 'POST',
//               credentials: 'include'
//           }).then((res) => {
//             if (res.ok) {
//               setUserInfo(null)
//             }
//           })
            
//         }
//     return (
//         <>
//            {username ? (
//                 <div>
//                     Welcome! {username} <button onClick={logoutUser}>Logout</button>
//                 </div>
//             ) : (
//                 <Link to="/signin"></Link>
//             )}
//         </>
//   )
// }
import { useContext ,useEffect} from "react";
import { UserContext } from "./UserContext";
import Signin from './SignIn'
import './App.css'
function Profile() {
  const { userInfo,setUserInfo } = useContext(UserContext);
  useEffect(() => {
            const url = import.meta.env.VITE_API_URL + '/profile'
            try {
                fetch(url, {
                    'method': 'GET',
                    'credentials': 'include',
                       
                })
                    .then((res) => res.json())
                    .then((info) => {
                           if(info){

                             setUserInfo(info)
                           console.log(info);
                           }
                           else {
                               setUserInfo(null)
                        }
                    })
          }
           
                catch(err) {
                    
                    return err
                }
           
        },[])
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
if(!userInfo || !userInfo.email){
  return <Signin/>
}else{


  return (
  // {userInfo?.email?(
  //   <div className="card profile-card">
  //   <div style={{
  //     display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem"
  //   }}>
  //     <div style={{
  //       width: 48, height: 48, borderRadius: "50%", background: "var(--primary)",
  //       display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
  //       fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem"
  //     }}>
  //       {userInfo?.email?.charAt(0).toUpperCase() || "U"}
  //     </div>
  //     <div style={{ fontWeight: 500, fontSize: "0.95rem", wordBreak: "break-all", textAlign: "center" }}>
  //       {userInfo?.email}
  //     </div>
  //     <button className="action-button profile-logout-btn" style={{ width: "100%", fontSize: "0.95rem", padding: "0.4rem 0.5rem" }} onClick={logoutUser}>
  //       Logout
  //     </button>
  //   </div>
  // </div>
  // ):
  // (<div>'pls sign in'</div>)}

    <div className="card profile-card">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          {userInfo?.email?userInfo.email.charAt(0).toUpperCase() : "U"}
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: "0.95rem",
            wordBreak: "breakword",
            textAlign: "center",
          }}
        >
          {userInfo.email}
        </div>
        <button
          className="action-button profile-logout-btn"
          style={{
            width: "100%",
            fontSize: "0.95rem",
            padding: "0.4rem 0.5rem",
          }}
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </div>
  ) 
  


}
}
export default Profile;
// export default Profile
