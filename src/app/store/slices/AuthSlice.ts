import { boolean } from "zod";
import type { User } from "../../../features/auth/types/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  accessToken: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  isLoading: boolean
}

const initalState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: boolean,
  isLoading: boolean,
};

const authSlice = createSlice({
  name: "auth",
  initalState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user,
        state.accessToken = accessToken,
        state.refreshToken = refreshToken,
        state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null,
        state.refreshToken = null,
        state.isAuthenticated = false;

      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
  // reducers: {
  //   setLoading: (state, action: PayloadAction<boolean>) => {
  //     state.loading = action.payload;
  //   },
  //   setUser: (state, action: PayloadAction<User | null>) => {
  //     state.user = action.payload;
  //   },
  //   setError: (state, action: PayloadAction<string | null>) => {
  //     state.error = action.payload;
  //   },
  // },
});

export const { setCredentials, updateAccessToken, logout, setLoading } = authSlice.actions
export default authSlice.reducer
