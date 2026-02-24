import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Auth.css';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [income, setIncome] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function signUpUser(ev) {
        ev.preventDefault();
        setError('');

        if (!email || !password || !income) {
            setError('All fields are required');
            return;
        }
        if (Number(income) <= 0) {
            setError('Income must be greater than 0');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, income: Number(income) })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create account. Please try again.');
            }

            navigate('/signin');
        } catch (err) {
            setError(err.message || 'An error occurred. Email might already be in use.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="card">
            <h1 style={{ textAlign: 'center', color: 'black', fontSize: '2rem', fontWeight: 'bold', marginTop: '50px', marginBottom: '20px' }}>
                Sign Up
            </h1>

            {error && (
                <div style={{
                    backgroundColor: '#ffebee', color: '#d32f2f', padding: '12px 20px',
                    borderRadius: '4px', margin: '0 0 20px', borderLeft: '4px solid #f44336',
                    display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    <span style={{ fontWeight: 'bold' }}>Error:</span>
                    <span>{error}</span>
                </div>
            )}

            <form className="signup-form" onSubmit={signUpUser}>
                <input
                    type="email" required placeholder="Email"
                    onChange={ev => setEmail(ev.target.value)} value={email}
                    className="input-field"
                />
                <input
                    type="password" required placeholder="Password"
                    onChange={ev => setPassword(ev.target.value)} value={password}
                    className="input-field" minLength={6}
                />
                <input
                    type="number" required placeholder="Monthly Income"
                    value={income} onChange={e => setIncome(e.target.value)}
                    className="input-field" min="1" step="0.01"
                />
                <button className="signup-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span>Already have an account? </span>
                <Link to="/signin" style={{ color: '#1976d2', textDecoration: 'none' }}>Sign In</Link>
            </div>
        </div>
    );
}

export default SignUp;
