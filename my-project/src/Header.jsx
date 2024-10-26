import React from 'react'
import { Link } from 'react-router-dom'
import './CSS/Header.css'
function Header() {
  return (
      <header>
          <Link to="/signin">SignIn</Link>
          <Link to="/signup">SignUp</Link>
    </header>
  )
}

export default Header