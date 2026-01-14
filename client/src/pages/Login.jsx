import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css'; // Using CSS modules for component-specific styles

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2>Welcome Back</h2>
                <p className={styles.subtitle}>Sign in to access your account</p>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginBtn}>Sign In</button>
                </form>
                <p className={styles.registerLink}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
