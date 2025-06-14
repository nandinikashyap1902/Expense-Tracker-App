import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "./Store/Slices/authSlice";
import './App.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Add debugging log to see state changes
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, isLoading, hasUser: !!user });
  }, [isAuthenticated, isLoading, user]);

  // Clear any auth errors when component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Redirecting to home page...");
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  async function signInUser(ev) {
    ev.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      console.log("Login result:", resultAction);
      
      if (!resultAction.error) {
        // Force navigation on success even if state update is delayed
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
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
          disabled={isLoading}
        />
        <input 
          type="password" 
          required 
          placeholder='Password' 
          onChange={ev => setPassword(ev.target.value)} 
          value={password} 
          className="input-field" 
          disabled={isLoading}
        />
        <button className="signup-button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <h1>OR</h1>
      <Link to="/signup" style={{textDecoration:'underline'}}>Sign Up</Link>
    </div>
  );
}

export default SignIn;