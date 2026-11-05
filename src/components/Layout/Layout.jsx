import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../Header/Header.jsx'
import Footer from '../Footer/Footer.jsx'
import { selectToken } from '../../store/authSlice.js'
import { fetchUserProfile } from '../../store/userSlice.js'

function Layout() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)

  // Load the profile once per login (also after a page refresh),
  // so the header and the profile page share the same data.
  // If the user logs out before the answer arrives, the request is
  // cancelled so old data never comes back into the store.
  useEffect(() => {
    if (!token) return
    const request = dispatch(fetchUserProfile())
    return () => request.abort()
  }, [token, dispatch])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
