import { Link } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import logo from '../../assets/images/argent-bank-logo.webp'

// Static for now: shows the user's name and "Sign Out" once Redux is wired (step 2)
function Header() {
  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={logo}
          alt="Argent Bank Logo"
          width="200"
          height="54"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        <Link className="main-nav-item" to="/login">
          <FaUserCircle aria-hidden="true" />
          Sign In
        </Link>
      </div>
    </nav>
  )
}

export default Header
