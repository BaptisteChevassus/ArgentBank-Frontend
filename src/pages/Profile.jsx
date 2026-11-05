import Account from '../components/Account/Account.jsx'
import { accounts } from '../data/accounts.js'

function Profile() {
  return (
    <main className="main bg-dark">
      <title>Argent Bank - Profile</title>
      {/* Static name for now: comes from the API in step 2, editable in step 3 */}
      <div className="header">
        <h1>
          Welcome back
          <br />
          Tony Jarvis!
        </h1>
        <button type="button" className="edit-button">
          Edit Name
        </button>
      </div>
      <h2 className="sr-only">Accounts</h2>
      {accounts.map((account) => (
        <Account
          key={account.id}
          title={account.title}
          amount={account.amount}
          description={account.description}
        />
      ))}
    </main>
  )
}

export default Profile
