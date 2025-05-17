import { useState } from "react"
import './App.css'
function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [income, setIncome] = useState(0)
    function signUpUser(ev) {
        ev.preventDefault();
        const url = import.meta.env.VITE_API_URL + '/signup'
        try {
            
            fetch(url, {
                method: 'POST',
                headers: { 'Content-type': 'application/json'},
                body:JSON.stringify({email:email,
                    password:password,
                    income}) 
            })
        } catch (err) {
            console.error(err)
        }
    }
  return (
      
      <div className="card">
      <h1 style={{textAlign:'center',color:'black' ,fontSize:'2rem' ,fontWeight:'bold',marginTop:'50px' }}>Sign Up</h1>
          <form className="signup-form" onSubmit={signUpUser}>
              <input type="email" required placeholder='email' onChange={ev => setEmail(ev.target.value)} value={email} className="input-field" />
              <input type="password" required placeholder='password' onChange={ev => setPassword(ev.target.value)} value={ password} className="input-field" />
              <label>salary</label>
            
<input
  type="number"
  placeholder="Enter your salary"
  value={income}
  onChange={e => setIncome(Number(e.target.value))}
  className="input-field"
/>

              <button className="signup-button">signup</button>
          </form>
          </div>
      
  )
}

export default SignUp