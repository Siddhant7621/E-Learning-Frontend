import React from "react";
import {Link} from 'react-router-dom'
import "./Header.css"

const Header = ({isAuth}) => {
  return (
    <header>
      <div className="logo">E-Learning</div>

      <div className="link">
          <Link to={'/'}>Home</Link>
          <Link to={'/courses'}>Courses</Link>
          <Link to={'/about'}>About</Link>
          {
            isAuth?<Link to={'/account'}>Account</Link> : <Link to={'/login'}>Login</Link>
          }



      </div>
    </header>
  )
}

export default Header;

