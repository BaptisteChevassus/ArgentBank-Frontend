import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginRequest } from '../services/api.js'

const TOKEN_KEY = 'argentBankToken'

// "Remember me" keeps the token after the browser is closed (localStorage),
// otherwise it only lasts for the current tab session (sessionStorage)
const readStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const { token } = await loginRequest(email, password)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem(TOKEN_KEY, token)
      return token
    } catch (error) {
      // Same message for unknown email or wrong password: don't reveal which one
      const message =
        error.status === 400
          ? 'Invalid username or password.'
          : error.message
      return rejectWithValue(message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: readStoredToken(),
    status: 'idle', // 'idle' | 'loading' | 'failed'
    error: null,
  },
  reducers: {
    loggedOut(state) {
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    authErrorCleared(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { loggedOut, authErrorCleared } = authSlice.actions

// Clears the stored token, then the whole user state (see userSlice)
export const logout = () => (dispatch) => {
  clearStoredToken()
  dispatch(loggedOut())
}

export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
