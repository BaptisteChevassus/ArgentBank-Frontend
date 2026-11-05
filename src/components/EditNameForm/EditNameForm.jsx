import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectProfile,
  selectUpdateError,
  selectUpdateStatus,
  updateErrorCleared,
  updateUserName,
} from '../../store/userSlice.js'

// Only the username can be changed: first and last names are read-only
function EditNameForm({ onClose }) {
  const dispatch = useDispatch()
  const profile = useSelector(selectProfile)
  const updateStatus = useSelector(selectUpdateStatus)
  const updateError = useSelector(selectUpdateError)
  // The form is mounted when editing starts, so it starts from the current username
  const [userName, setUserName] = useState(profile.userName)
  const [validationError, setValidationError] = useState(null)
  const isSaving = updateStatus === 'saving'

  // Don't keep an old error once the form is closed
  useEffect(() => {
    return () => dispatch(updateErrorCleared())
  }, [dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newUserName = userName.trim()

    if (!newUserName) {
      setValidationError('Username cannot be empty.')
      return
    }
    // Nothing changed: no need to call the API
    if (newUserName === profile.userName) {
      onClose()
      return
    }

    setValidationError(null)
    const result = await dispatch(updateUserName(newUserName))
    if (updateUserName.fulfilled.match(result)) {
      onClose()
    }
  }

  const error = validationError ?? updateError

  return (
    <form className="edit-name-form" onSubmit={handleSubmit}>
      <div className="edit-name-field">
        <label htmlFor="userName">User name:</label>
        <input
          type="text"
          id="userName"
          autoComplete="nickname"
          autoFocus
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="edit-name-field">
        <label htmlFor="firstName">First name:</label>
        <input type="text" id="firstName" value={profile.firstName} disabled />
      </div>
      <div className="edit-name-field">
        <label htmlFor="lastName">Last name:</label>
        <input type="text" id="lastName" value={profile.lastName} disabled />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="edit-name-buttons">
        <button type="submit" className="edit-button" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="edit-button"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditNameForm
