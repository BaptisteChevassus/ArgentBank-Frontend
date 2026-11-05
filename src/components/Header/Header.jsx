import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import logo from '../../assets/images/argent-bank-logo.webp'
import { logout, selectIsAuthenticated } from '../../store/authSlice.js'
import { selectProfile } from '../../store/userSlice.js'

function Header() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const profile = useSelector(selectProfile)
  const { pathname } = useLocation()
  const isSigningOut = useRef(false)

  // The "Sign Out" link first takes the user to the home page, then the
  // session is cleared. Clearing it while still on /profile would make the
  // protected route redirect to /login instead of the home page.
  useEffect(() => {
    if (isSigningOut.current && pathname === '/') {
      isSigningOut.current = false
      dispatch(logout())
    }
  }, [pathname, dispatch])

  const handleSignOut = () => {
    if (pathname === '/') {
      dispatch(logout()) // already on the home page: nothing to wait for
    } else {
      isSigningOut.current = true
    }
  }

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
        {isAuthenticated ? (
          <>
            <Link className="main-nav-item" to="/profile">
              <FaUserCircle aria-hidden="true" />
              {profile?.userName}
            </Link>
            <Link className="main-nav-item" to="/" onClick={handleSignOut}
            >
              <FaSignOutAlt aria-hidden="true" />
              Sign Out
            </Link>
          </>
        ) : (
          <Link className="main-nav-item" to="/login">
            <FaUserCircle aria-hidden="true" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Header
