import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../Header/Header.jsx'
import Footer from '../Footer/Footer.jsx'
import { selectToken } from '../../store/authSlice.js'
import { fetchUserProfile, selectProfileStatus } from '../../store/userSlice.js'

function Layout() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const profileStatus = useSelector(selectProfileStatus)

  // Load the profile once per login (also after a page refresh),
  // so the header and the profile page share the same data
  useEffect(() => {
    if (token && profileStatus === 'idle') {
      dispatch(fetchUserProfile())
    }
  }, [token, profileStatus, dispatch])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
