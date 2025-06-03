import { useState } from "react"
import './App.css'
import { useNavigate, Link } from "react-router-dom"

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [income, setIncome] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate();

    async function signUpUser(ev) {
        ev.preventDefault();
        setError(''); // Clear previous errors
        
        // Basic validation
        if (!email || !password || !income) {
            setError('All fields are required');
            return;
        }

        if (income <= 0) {
            setError('Income must be greater than 0');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const url = import.meta.env.VITE_API_URL + '/signup'
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    income: Number(income)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Check for duplicate email error
                if (response.status === 400 && data.message && data.message.includes('already exists')) {
                    throw new Error('An account with this email already exists. Please use a different email or sign in.');
                }
                throw new Error(data.message || 'Failed to create account. Please try again.');
            }

            // Clear form and navigate to sign-in on success
            setEmail('');
            setPassword('');
            setIncome('');
            navigate('/signin');
            
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'An error occurred. Email might already be in use.');
        } finally {
            setIsSubmitting(false);
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
                />
                <input 
                    type="password" 
                    required 
                    placeholder='Password' 
                    onChange={ev => setPassword(ev.target.value)} 
                    value={password} 
                    className="input-field" 
                    minLength={6}
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
                />
                
                <button 
                    className="signup-button" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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