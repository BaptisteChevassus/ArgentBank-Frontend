import UserHeader from '../components/UserHeader/UserHeader.jsx'
import Account from '../components/Account/Account.jsx'
import { accounts } from '../data/accounts.js'

function Profile() {
  return (
    <main className="main bg-dark">
      <title>Argent Bank - Profile</title>
      <UserHeader />
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
