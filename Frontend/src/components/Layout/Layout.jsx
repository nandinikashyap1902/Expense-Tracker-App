import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { FaWallet, FaHome, FaHistory, FaSignOutAlt, FaTimes, FaBars, FaPlus } from 'react-icons/fa';
import Chatbot from '../Chatbot/Chatbot';
import './Layout.css';

const Layout = ({ children }) => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUserInfo(null);
            navigate('/signin');
        } catch {
            // Even if the request fails, clear local state
            setUserInfo(null);
            navigate('/signin');
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="app-container">
            {/* Mobile Toggle */}
            <button className="sidebar-toggle-mobile" onClick={toggleSidebar} aria-label="Toggle sidebar">
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <Link to="/" className="brand-logo">
                    <FaWallet /> ExpenseTracker
                </Link>

                <nav className="nav-links">
                    <button
                        className={`nav-item ${isActive('/')}`}
                        onClick={() => { navigate('/'); setIsSidebarOpen(false); }}
                    >
                        <FaHome /> Dashboard
                    </button>
                    <button
                        className={`nav-item ${isActive('/transactions')}`}
                        onClick={() => { navigate('/transactions'); setIsSidebarOpen(false); }}
                    >
                        <FaHistory /> Transactions
                    </button>
                    <button
                        className={`nav-item ${isActive('/add-new-expense')}`}
                        onClick={() => { navigate('/add-new-expense'); setIsSidebarOpen(false); }}
                    >
                        <FaPlus /> Add New
                    </button>
                </nav>

                <div className="user-profile-mini">
                    <div className="avatar-mini">
                        {userInfo?.email ? userInfo.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {userInfo?.email?.split('@')[0]}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Free Plan</div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn-mini" title="Logout">
                        <FaSignOutAlt />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="app-main">
                {children}
            </main>

            <Chatbot />
        </div>
    );
};

export default Layout;
