import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo} onClick={() => navigate('/')}>
                Raichuru Belaku
            </div>
            <nav className={styles.nav}>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <button onClick={() => navigate('/admin/dashboard')} className={styles.navLink}>
                                Dashboard
                            </button>
                        )}
                        <span className={styles.userName}>Hello, {user.name}</span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')} className={styles.navLink}>Login</button>
                        <button onClick={() => navigate('/register')} className={styles.registerBtn}>Register</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
