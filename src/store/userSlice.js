import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfileRequest, updateProfileRequest } from '../services/api.js'
import { loggedOut, logout } from './authSlice.js'

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, dispatch, rejectWithValue, signal }) => {
    try {
      // signal: the HTTP request is really cancelled when the thunk is aborted
      return await getProfileRequest(getState().auth.token, signal)
    } catch (error) {
      // Expired or invalid token: log the user out
      if (error.status === 401) dispatch(logout())
      return rejectWithValue(error.message)
    }
  },
)

// Saves the new username in the database (PUT /user/profile)
export const updateUserName = createAsyncThunk(
  'user/updateUserName',
  async (userName, { getState, dispatch, rejectWithValue }) => {
    try {
      // The API answers with the updated profile (no password)
      return await updateProfileRequest(getState().auth.token, userName)
    } catch (error) {
      if (error.status === 401) dispatch(logout())
      return rejectWithValue('Unable to save your username. Please try again.')
    }
  },
)

const initialState = {
  profile: null, // { id, email, firstName, lastName, userName, createdAt, updatedAt }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  updateStatus: 'idle', // 'idle' | 'saving' | 'failed'
  updateError: null,
  // ID of the request in progress: an answer arriving after a logout
  // (or after a newer request) no longer matches and is ignored
  profileRequestId: null,
  updateRequestId: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateErrorCleared(state) {
      state.updateStatus = 'idle'
      state.updateError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state, action) => {
        state.status = 'loading'
        state.profileRequestId = action.meta.requestId
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.profileRequestId) return
        state.status = 'succeeded'
        state.profile = action.payload
        state.profileRequestId = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        // Outdated or cancelled request (logout, new login): nothing to report
        if (action.meta.requestId !== state.profileRequestId) return
        if (action.meta.aborted) return
        state.status = 'failed'
        state.profileRequestId = null
      })
      .addCase(updateUserName.pending, (state, action) => {
        state.updateStatus = 'saving'
        state.updateError = null
        state.updateRequestId = action.meta.requestId
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.updateRequestId) return
        state.updateStatus = 'idle'
        state.updateRequestId = null
        // Every component reading the profile (header, profile page) updates
        state.profile = action.payload
      })
      .addCase(updateUserName.rejected, (state, action) => {
        if (action.meta.requestId !== state.updateRequestId) return
        state.updateStatus = 'failed'
        state.updateError = action.payload
        state.updateRequestId = null
      })
      // Logging out wipes the user's data from the store
      .addCase(loggedOut, () => initialState)
  },
})

export const { updateErrorCleared } = userSlice.actions

export const selectProfile = (state) => state.user.profile
export const selectProfileStatus = (state) => state.user.status
export const selectUpdateStatus = (state) => state.user.updateStatus
export const selectUpdateError = (state) => state.user.updateError

export default userSlice.reducer
