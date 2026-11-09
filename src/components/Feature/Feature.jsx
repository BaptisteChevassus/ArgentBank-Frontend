// The icon is decorative (the title says it all), hence the empty alt
function Feature({ icon, title, children }) {
  return (
    <div className="feature-item">
      <img src={icon} alt="" className="feature-icon" width="100" height="100" />
      <h3 className="feature-item-title">{title}</h3>
      <p>{children}</p>
    </div>
  )
}

export default Feature
