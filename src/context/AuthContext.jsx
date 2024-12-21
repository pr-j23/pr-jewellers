import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from localStorage on initialization
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser ? storedUser : null;
  });

  const login = (email, password) => {
    // Dummy login logic - in real app, this would validate against a backend
    if (email === "admin@example.com" && password === "admin123") {
      const user = { email, role: "admin" };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
