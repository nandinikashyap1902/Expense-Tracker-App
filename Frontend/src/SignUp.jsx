import { useState, useEffect } from "react"
import './App.css'
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearAuthError } from "./Store/Slices/authSlice"

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [income, setIncome] = useState('')
    
    const dispatch = useDispatch()
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth)
    const navigate = useNavigate();

    // Clear any auth errors when component mounts
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);
    
    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    async function signUpUser(ev) {
        ev.preventDefault();
        
        // Basic validation
        if (!email || !password || !income) {
            return;
        }

        if (income <= 0) {
            return;
        }

        // Dispatch registration action
        const result = await dispatch(registerUser({
            email,
            password,
            income: Number(income)
        }));
        
        // If registration was successful, redirect to home page
        // The auth slice will handle saving the user to localStorage
        if (!result.error) {
            navigate('/');
        }
    }

    return (
        <div className="card">
            <h1 style={{
                textAlign: 'center',
                color: 'black',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginTop: '50px',
                marginBottom: '20px'
            }}>Sign Up</h1>
            
            {/* Error Message Display */}
            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    margin: '0 20px 20px',
                    borderLeft: '4px solid #f44336',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{fontWeight: 'bold'}}>Error:</span>
                    <span>{error}</span>
                </div>
            )}
            
            <form className="signup-form" onSubmit={signUpUser}>
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
                    minLength={6}
                    disabled={isLoading}
                />
                <input
                    type="number"
                    required
                    placeholder="Monthly Income"
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    className="input-field"
                    min="1"
                    step="0.01"
                    disabled={isLoading}
                />
                
                <button 
                    className="signup-button" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span>Already have an account? </span>
                <Link to="/signin" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Sign In
                </Link>
            </div>
        </div>
    )
}

export default SignUp