import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaUserCircle } from 'react-icons/fa'
import SignInForm from '../components/SignInForm/SignInForm.jsx'
import { selectIsAuthenticated } from '../store/authSlice.js'

function SignIn() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Already logged in: no need to show the form again
  if (isAuthenticated) return <Navigate to="/profile" replace />

  return (
    <main className="main bg-dark">
      <title>Argent Bank - Sign In</title>
      <section className="sign-in-content">
        <FaUserCircle className="sign-in-icon" aria-hidden="true" />
        <h1>Sign In</h1>
        <SignInForm />
      </section>
    </main>
  )
}

export default SignIn
