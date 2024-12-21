import { toast } from "react-hot-toast";
import {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logout,
  setLoading,
} from "../slices/authSlice";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const userData = await response.json();
    if (response.ok) {
      return userData;
    } else {
      throw new Error(userData.message || "Login failed");
    }
  } catch (error) {
    toast.error("Login failed: " + error.message);
    throw error;
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    const userData = await response.json();
    if (response.ok) {
      return userData;
    } else {
      throw new Error(userData.message || "Signup failed");
    }
  } catch (error) {
    toast.error("Signup failed: " + error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await fetch("/api/logout", { method: "POST" });
    toast.success("Successfully logged out!");
  } catch (error) {
    toast.error("Logout failed: " + error.message);
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch("/api/refresh-token", { method: "POST" });
    const newTokenData = await response.json();
    if (response.ok) {
      return newTokenData;
    } else {
      throw new Error(newTokenData.message || "Token refresh failed");
    }
  } catch (error) {
    toast.error("Token refresh failed: " + error.message);
    throw error;
  }
};

export const getStoredUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Failed to retrieve stored user:", error);
    return null;
  }
};
