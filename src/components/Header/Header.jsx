import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const isSigningOut = useRef(false)

  // "Sign Out" first takes the user to the home page, then the session is
  // cleared. React Router changes page in a transition while Redux updates
  // at once: clearing the session while still on /profile would make the
  // protected route redirect to /login instead of the home page.
  useEffect(() => {
    if (isSigningOut.current && pathname === '/') {
      isSigningOut.current = false
      dispatch(logout())
    }
  }, [pathname, dispatch])

  const handleSignOut = (event) => {
    // Always handled here, even with Ctrl/Cmd-click (no logout in a new tab)
    event.preventDefault()
    if (pathname === '/') {
      dispatch(logout()) // already on the home page: nothing to wait for
    } else {
      isSigningOut.current = true
      navigate('/')
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
            <Link
              className="main-nav-item"
              to="/profile"
              // Name for screen readers while the profile is still loading
              aria-label={profile ? undefined : 'Profile'}
            >
              <FaUserCircle aria-hidden="true" />
              {profile?.userName}
            </Link>
            <Link className="main-nav-item" to="/" onClick={handleSignOut}>
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
