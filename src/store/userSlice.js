import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfileRequest } from '../services/api.js'
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

const initialState = {
  profile: null, // { id, email, firstName, lastName, userName }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
      // Logging out wipes the user's data from the store
      .addCase(loggedOut, () => initialState)
  },
})

export const selectProfile = (state) => state.user.profile
export const selectProfileStatus = (state) => state.user.status

export default userSlice.reducer
