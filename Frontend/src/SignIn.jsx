import { useState } from "react"
import { UserContext } from "./UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const {setUserInfo} = useContext(UserContext)
  const navigate = useNavigate();

  async function signInUser(ev) {
    ev.preventDefault();
    setError(''); // Clear previous errors
    const url = import.meta.env.VITE_API_URL + '/signin'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json();
      // In SignIn.jsx
      async function signInUser(ev) {
        ev.preventDefault();
        setError(''); // Clear previous errors
        const url = import.meta.env.VITE_API_URL + '/signin'
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
          });
      
          if (response.ok) {
            // Fetch the profile data after successful login
            const profileResponse = await fetch(import.meta.env.VITE_API_URL + '/profile', {
              credentials: 'include'
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setUserInfo(profileData);
              navigate('/');
            } else {
              throw new Error('Failed to fetch profile data');
            }
          } else {
            const data = await response.json();
            setError(data.message || 'Invalid email or password');
          }
        } catch (err) {
          console.error(err);
          setError(err.message || 'An error occurred. Please try again.');
        }
      }
      if (response.ok) {
        setUserInfo({ email })
        navigate('/');
      } else {
        // Handle different error cases
        setError(data.message || 'Invalid email or password');
      }
      
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="card">
      <h1 style={{textAlign:'center',color:'black', fontSize:'2rem', fontWeight:'bold', marginTop:'50px'}}>Sign In</h1>
      {error && (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
          {error}
        </div>
      )}
      <form className="signup-form" onSubmit={signInUser}>
        <input 
          type="email" 
          required 
          placeholder='Email' 
          onChange={ev => setEmail(ev.target.value)} 
          value={email} 
          className="input-field" 
        />
        <input 
          type="password" 
          required 
          placeholder='Password' 
          onChange={ev => setPassword(ev.target.value)} 
          value={password} 
          className="input-field" 
        />
        <button className="signup-button">Sign In</button>
      </form>
      <h1>OR</h1>
      <Link to="/signup" style={{textDecoration:'underline'}}>Sign Up</Link>
    </div>
  )
}

export default SignIn