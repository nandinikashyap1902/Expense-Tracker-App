import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfoState] = useState(() => {
        const saved = localStorage.getItem('userInfo');
        return saved ? JSON.parse(saved) : {};
    });
    const [income, setIncomeState] = useState(0);
    const [expense, setExpenseState] = useState(0);

    // Persist userInfo to localStorage on change
    const setUserInfo = (info) => {
        setUserInfoState(info);
        if (info && Object.keys(info).length > 0) {
            localStorage.setItem('userInfo', JSON.stringify(info));
        } else {
            localStorage.removeItem('userInfo');
        }
    };

    // Validate session with backend on every app load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (userData) {
                        setUserInfo(userData);
                        setIncomeState(userData.income || 0);
                    }
                } else {
                    setUserInfo(null); // Session expired — clear local state
                }
            } catch {
                setUserInfo(null);
            }
        };

        checkSession();
    }, []);

    return (
        <UserContext.Provider value={{
            userInfo,
            setUserInfo,
            income,
            setIncome: (value) => {
                setIncomeState(value);
                setUserInfo({ ...userInfo, income: value });
            },
            expense,
            setExpense: setExpenseState
        }}>
            {children}
        </UserContext.Provider>
    );
}
