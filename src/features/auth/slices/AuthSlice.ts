import type { User } from "../types/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>,
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    updateVerificationStatus: (
      state,
      action: PayloadAction<"PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED">,
    ) => {
      if (state.user) {
        state.user.verificationStatus = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
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

export const {
  setCredentials,
  updateAccessToken,
  logout,
  setLoading,
  updateVerificationStatus,
} = authSlice.actions;
export default authSlice.reducer;
