import Hero from '../components/Hero/Hero.jsx'
import Feature from '../components/Feature/Feature.jsx'
import { features } from '../data/features.js'

function Home() {
  return (
    <main>
      <title>Argent Bank - Home Page</title>
      <Hero />
      <section className="features">
        <h2 className="sr-only">Features</h2>
        {features.map((feature) => (
          <Feature
            key={feature.id}
            icon={feature.icon}
            iconAlt={feature.iconAlt}
            title={feature.title}
          >
            {feature.text}
          </Feature>
        ))}
      </section>
    </main>
  )
}

export default Home
