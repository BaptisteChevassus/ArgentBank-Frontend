import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import EditNameForm from '../EditNameForm/EditNameForm.jsx'
import { selectProfile, selectProfileStatus } from '../../store/userSlice.js'

// Top of the profile page: welcome message, or the username edit form
function UserHeader() {
  const profile = useSelector(selectProfile)
  const profileStatus = useSelector(selectProfileStatus)
  const [isEditing, setIsEditing] = useState(false)
  const editButton = useRef(null)

  // Give the focus back to "Edit Name" once the form is closed,
  // instead of losing it (keyboard and screen reader users)
  const closeForm = () => {
    setIsEditing(false)
    requestAnimationFrame(() => editButton.current?.focus())
  }

  if (isEditing && profile) {
    return (
      <div className="header">
        <h1>Edit user info</h1>
        <EditNameForm onClose={closeForm} />
      </div>
    )
  }

  return (
    <div className="header">
      <h1>
        Welcome back
        <br />
        {profile ? `${profile.firstName} ${profile.lastName}!` : '…'}
      </h1>
      {profileStatus === 'failed' && (
        <p className="form-error" role="alert">
          Unable to load your profile. Please refresh the page.
        </p>
      )}
      <button
        type="button"
        className="edit-button"
        ref={editButton}
        onClick={() => setIsEditing(true)}
        disabled={!profile}
      >
        Edit Name
      </button>
    </div>
  )
}

export default UserHeader
