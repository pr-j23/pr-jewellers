import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  user: {
    id: null,
    email: null,
    name: null,
    role: "GUEST",
    isAuthenticated: false,
  },
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    loginSuccess(state, action) {
      state.user = { ...action.payload, isAuthenticated: true };
      state.loading = false;
      toast.success("Successfully logged in!");
    },
    loginFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      toast.error("Login failed: " + action.payload.message);
    },
    signupSuccess(state, action) {
      state.user = { ...action.payload, isAuthenticated: true };
      state.loading = false;
      toast.success("Account created successfully!");
    },
    signupFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
      toast.error("Signup failed: " + action.payload.message);
    },
    logout(state) {
      state.user = {
        id: null,
        email: null,
        name: null,
        role: "GUEST",
        isAuthenticated: false,
      };
      toast.success("Successfully logged out!");
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
