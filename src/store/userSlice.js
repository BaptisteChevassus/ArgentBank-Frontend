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
      const updatedUser = await updateProfileRequest(
        getState().auth.token,
        userName,
      )
      // The API sends back the whole user (password hash included):
      // only the username is kept
      return updatedUser.userName
    } catch (error) {
      if (error.status === 401) dispatch(logout())
      return rejectWithValue('Unable to save your username. Please try again.')
    }
  },
)

const initialState = {
  profile: null, // { id, email, firstName, lastName, userName }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  updateStatus: 'idle', // 'idle' | 'saving' | 'failed'
  updateError: null,
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
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        // Cancelled request (logout or new login): nothing to report
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updateUserName.pending, (state) => {
        state.updateStatus = 'saving'
        state.updateError = null
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.updateStatus = 'idle'
        // Every component reading the profile (header, profile page) updates
        if (state.profile) state.profile.userName = action.payload
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.updateError = action.payload
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
