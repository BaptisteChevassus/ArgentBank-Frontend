import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      {/* Every page shares the same header and footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
