import { createContext, useState } from "react";

export const UserContext = createContext()
export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState({})
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  return (
      <UserContext.Provider value={{userInfo,setUserInfo,income,setIncome,expense,setExpense}}>
       {children}
    </UserContext.Provider>
  )
}

