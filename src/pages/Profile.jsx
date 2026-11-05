import { useSelector } from 'react-redux'
import Account from '../components/Account/Account.jsx'
import { accounts } from '../data/accounts.js'
import { selectProfile, selectProfileStatus } from '../store/userSlice.js'

function Profile() {
  const profile = useSelector(selectProfile)
  const status = useSelector(selectProfileStatus)

  return (
    <main className="main bg-dark">
      <title>Argent Bank - Profile</title>
      <div className="header">
        <h1>
          Welcome back
          <br />
          {profile ? `${profile.firstName} ${profile.lastName}!` : '…'}
        </h1>
        {status === 'failed' && (
          <p className="form-error" role="alert">
            Unable to load your profile. Please refresh the page.
          </p>
        )}
        {/* Opens the username edit form in step 3 */}
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
