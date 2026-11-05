function Feature({ icon, iconAlt, title, children }) {
  return (
    <div className="feature-item">
      <img
        src={icon}
        alt={iconAlt}
        className="feature-icon"
        width="100"
        height="100"
        loading="lazy"
      />
      <h3 className="feature-item-title">{title}</h3>
      <p>{children}</p>
    </div>
  )
}

export default Feature
