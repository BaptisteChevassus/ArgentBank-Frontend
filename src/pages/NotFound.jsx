import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="main bg-dark">
      <title>Argent Bank - Page not found</title>
      <section className="not-found">
        <h1>404</h1>
        <p>This page does not exist.</p>
        <Link to="/">Back to the home page</Link>
      </section>
    </main>
  )
}

export default NotFound
