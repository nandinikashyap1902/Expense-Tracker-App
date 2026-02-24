import { useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Auth.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    async function signInUser(ev) {
        ev.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                // Fetch profile after login (sets income too)
                const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
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
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="card">
            <h1 style={{ textAlign: 'center', color: 'black', fontSize: '2rem', fontWeight: 'bold', marginTop: '50px' }}>
                Sign In
            </h1>
            {error && (
                <div className="error-message" style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
                    {error}
                </div>
            )}
            <form className="signup-form" onSubmit={signInUser}>
                <input
                    type="email" required placeholder="Email"
                    onChange={ev => setEmail(ev.target.value)} value={email}
                    className="input-field"
                />
                <input
                    type="password" required placeholder="Password"
                    onChange={ev => setPassword(ev.target.value)} value={password}
                    className="input-field"
                />
                <button className="signup-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <Link to="/signup" style={{ textDecoration: 'underline' }}>Sign Up</Link>
            </p>
        </div>
    );
}

export default SignIn;
