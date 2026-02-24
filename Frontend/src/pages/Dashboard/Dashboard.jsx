import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
    FaArrowUp, FaArrowDown, FaPlus, FaCreditCard, FaEdit,
    FaCoffee, FaCar, FaHome as FaHouse, FaBolt, FaHeartbeat,
    FaShoppingBag, FaFilm, FaGraduationCap, FaUser, FaTag
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { userInfo, income, setIncome } = useContext(UserContext);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [targetBalance, setTargetBalance] = useState('');

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    // API now returns { transactions, total, page, pages } with pagination
                    setTransactions(Array.isArray(data) ? data : data.transactions || []);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    const stats = useMemo(() => {
        let totalExp = 0;
        let totalInc = 0;
        transactions.forEach(t => {
            const amt = parseFloat(t.amount);
            if (t.type === 'expense') totalExp += amt;
            else if (t.type === 'income') totalInc += amt;
        });
        return {
            totalExpense: totalExp,
            totalIncome: totalInc,
            netTransactions: totalInc - totalExp,
            balance: (income || 0) + totalInc - totalExp
        };
    }, [transactions, income]);

    const chartData = useMemo(() => {
        const categories = {};
        transactions.forEach(t => {
            if (t.type !== 'income') {
                categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
            }
        });
        const labels = Object.keys(categories);
        const data = Object.values(categories);
        return {
            labels: labels.length ? labels : ['No Expenses'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
                borderWidth: 0,
            }],
        };
    }, [transactions]);

    const handleUpdateBalance = async (e) => {
        e.preventDefault();
        const newTarget = parseFloat(targetBalance);
        if (isNaN(newTarget)) return;
        const newBaseIncome = newTarget - stats.netTransactions;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: newBaseIncome }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setIncome(data.income);
                setIsEditingBalance(false);
            }
        } catch {
            // Silently fail — no console.error in prod
        }
    };

    const getCategoryIcon = (cat) => {
        switch (cat?.toLowerCase()) {
            case 'food': return <FaCoffee />;
            case 'transportation': return <FaCar />;
            case 'housing': return <FaHouse />;
            case 'utilities': return <FaBolt />;
            case 'healthcare': return <FaHeartbeat />;
            case 'shopping': return <FaShoppingBag />;
            case 'entertainment': return <FaFilm />;
            case 'education': return <FaGraduationCap />;
            case 'personal': return <FaUser />;
            default: return <FaTag />;
        }
    };

    if (isLoading) return <Layout><div className="loading-container"><div className="spinner" /></div></Layout>;

    return (
        <Layout>
            <div className="header-section">
                <div className="header-title">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        Hello, {userInfo?.email?.split('@')[0] || 'User'}! 👋
                    </motion.h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <motion.button
                    className="add-btn-dashboard"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add-new-expense')}
                >
                    <FaPlus /> Add New
                </motion.button>
                <motion.button
                    className="add-btn-dashboard"
                    style={{ marginLeft: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-ai-chat', {
                        detail: { message: 'Give me a monthly spending summary with insights.' }
                    }))}
                >
                    ✨ AI Summary
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <motion.div className="stat-card balance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="stat-label">Total Balance</div>
                        <button
                            onClick={() => { setTargetBalance(stats.balance); setIsEditingBalance(true); }}
                            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '0.4rem', color: 'white', cursor: 'pointer', display: 'flex' }}
                        >
                            <FaEdit />
                        </button>
                    </div>
                    <div className="stat-amount">₹{stats.balance.toFixed(2)}</div>
                    <div className="stat-icon" style={{ marginTop: 'auto', alignSelf: 'flex-end', marginBottom: 0 }}>
                        <FaCreditCard />
                    </div>
                </motion.div>

                <motion.div className="stat-card income" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="stat-icon"><FaArrowUp /></div>
                    <div className="stat-label">Total Income</div>
                    <div className="stat-amount">₹{(stats.totalIncome + (income || 0)).toFixed(2)}</div>
                </motion.div>

                <motion.div className="stat-card expense" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="stat-icon"><FaArrowDown /></div>
                    <div className="stat-label">Total Expense</div>
                    <div className="stat-amount">₹{stats.totalExpense.toFixed(2)}</div>
                </motion.div>
            </div>

            {/* Content Grid */}
            <div className="dashboard-content-grid">
                <motion.div className="chart-section" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                    <div className="section-header"><h2>Spending Overview</h2></div>
                    <div style={{ height: '300px', position: 'relative' }}>
                        <Doughnut
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                cutout: '70%',
                                plugins: {
                                    legend: { position: 'right', labels: { usePointStyle: true, padding: 20 } }
                                }
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div className="recent-activity-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <span className="view-all-link" onClick={() => navigate('/transactions')}>View All</span>
                    </div>
                    <div className="activity-list">
                        {transactions.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', margin: '2rem 0' }}>No recent activity</p>
                        ) : (
                            transactions.slice(0, 5).map(txn => (
                                <div className="activity-item" key={txn._id}>
                                    <div className="activity-info">
                                        <div className="activity-icon">{getCategoryIcon(txn.category)}</div>
                                        <div className="activity-details">
                                            <span className="activity-title">{txn.description || txn.category}</span>
                                            <span className="activity-date">{new Date(txn.datetime).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`activity-amount ${txn.type === 'expense' ? 'expense' : 'income'}`}>
                                        {txn.type === 'expense' ? '-' : '+'}₹{Math.abs(txn.amount)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Edit Balance Modal */}
            <AnimatePresence>
                {isEditingBalance && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: 'white', padding: '2rem', borderRadius: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        >
                            <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Update Balance</h2>
                            <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                Set your current total balance manually.
                            </p>
                            <form onSubmit={handleUpdateBalance}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Total Balance</label>
                                    <input
                                        type="number"
                                        value={targetBalance}
                                        onChange={(e) => setTargetBalance(e.target.value)}
                                        step="0.01"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1.1rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setIsEditingBalance(false)}
                                        style={{ padding: '0.75rem 1.5rem', border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        style={{ padding: '0.75rem 1.5rem', border: 'none', background: '#4f46e5', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                                        Update
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Dashboard;
