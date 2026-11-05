import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  authErrorCleared,
  loginUser,
  selectAuthError,
  selectAuthStatus,
} from '../../store/authSlice.js'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useDispatch()
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)
  const isLoading = status === 'loading'

  // Don't show an old error when coming back to the form
  useEffect(() => {
    return () => dispatch(authErrorCleared())
  }, [dispatch])

  // On success the token lands in the store and the SignIn page
  // redirects to /profile by itself
  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(loginUser({ email, password, rememberMe }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <label htmlFor="username">Username</label>
        <input
          type="email"
          id="username"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-remember">
        <input
          type="checkbox"
          id="remember-me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember-me">Remember me</label>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="sign-in-button" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

export default SignInForm
