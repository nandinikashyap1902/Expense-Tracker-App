import { useState } from "react"
import { UserContext } from "./UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
//import './CSS/Form.css'
import './App.css'
function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //const [income, setIncome] = useState(0)
  const {setUserInfo} = useContext(UserContext)
  const navigate = useNavigate();
 async function signInUser(ev) {
    ev.preventDefault();
    const url = import.meta.env.VITE_API_URL + '/signin'
    try {
      
  const response= await   fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password}),
        credentials:'include'
  })
      if (response.ok) {
        // Optionally, you can fetch the user profile after sign-in to get the correct income
        setUserInfo({ email})
        navigate('/');
      }
      
    } catch (err) {
      console.error(err)
    }
  }
  return (
    
      <div className="card">
         <h1 style={{textAlign:'center',color:'black' ,fontSize:'2rem' ,fontWeight:'bold',marginTop:'50px' }}>Sign In</h1>
          <form className="signup-form" onSubmit={signInUser}>
              <input type="email" required placeholder='email' onChange={ev => setEmail(ev.target.value)} value={email} className="input-field" />
              <input type="password" required placeholder='password' onChange={ev => setPassword(ev.target.value)} value={ password} className="input-field" />
             
              <button className="signup-button">signin</button>
          </form>
          <h1>OR</h1>
          <Link to="/signup" style={{textDecoration:'underline'}}>Sign Up</Link>
          </div>
      
  )
}

export default SignIn