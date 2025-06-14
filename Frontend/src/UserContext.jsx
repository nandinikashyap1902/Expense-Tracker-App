import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfoState] = useState(() => {
    // Initialize from localStorage if available
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : {};
  });
  const [income, setIncomeState] = useState(0);
  const [expense, setExpenseState] = useState(0);

  //Wrap setUserInfo to also save to localStorage
  const setUserInfo = (info) => {
    setUserInfoState(info);
    // Update income state when userInfo has income property
    console.log(info)
    if (info && info.income !== undefined) {
      setIncomeState(info.income);
    }
    if (info && Object.keys(info).length > 0) {
      localStorage.setItem('userInfo', JSON.stringify(info));
    } else {
      localStorage.removeItem('userInfo');
    }
  };

  //Check for existing session on initial load
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
        }
       
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    // console.log(income+'i here')
    // console.log(userInfo)
    // Only check session if we don't have user info
    if (!userInfo || !userInfo.email) {
      checkSession();
    }
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
