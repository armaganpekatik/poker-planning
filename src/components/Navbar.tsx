import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IoAlbums, IoMenu } from 'react-icons/io5';
import '../css/Navbar.scss'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <IoAlbums /> <br /> SCRUM POKER
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <IoMenu />
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/story-list">New Session</NavLink>
            </li>
            <li>
              <NavLink to="/view-plan-sm">View Session</NavLink>
            </li>        
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar