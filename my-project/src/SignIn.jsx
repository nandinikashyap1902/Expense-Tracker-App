import { useState } from "react"
import { UserContext } from "./UserContext";
import { useContext } from "react";
function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {setUserInfo} = useContext(UserContext)
 async function signInUser(ev) {
    ev.preventDefault();
    const url = import.meta.env.VITE_API_URL + '/signin'
    try {
      
  const response= await   fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials:'include'
  })
      if (response.ok) {
        
        setUserInfo(email)
        
      }
      
    } catch (err) {
      console.error(err)
    }
  }
  return (
      <>
          <form onSubmit={signInUser}>
              <input type="email" required placeholder='email' onChange={ev => setEmail(ev.target.value)} value={email} />
              <input type="password" required placeholder='password' onChange={ev => setPassword(ev.target.value)} value={ password} />
              <button>signup</button>
          </form>
      </>
  )
}

export default SignIn