import { useState } from "react"

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    function signUpUser(ev) {
        ev.preventDefault();
        const url = import.meta.env.VITE_API_URL +'/signup'
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body:JSON.stringify({email:email,
                password:password}) 
        })
    }
  return (
      <>
          <form onSubmit={signUpUser}>
              <input type="email" required placeholder='email' onChange={ev => setEmail(ev.target.value)} value={email} />
              <input type="password" required placeholder='password' onChange={ev => setPassword(ev.target.value)} value={ password} />
              <button>signup</button>
          </form>
      </>
  )
}

export default SignUp