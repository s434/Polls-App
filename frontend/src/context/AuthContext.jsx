import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return false; 
      }

      const data = await res.json();
      setUser(data);
      return true;   
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };
  const register = async (name, email, password) => {
  try {
    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Registration error:", errorData);
      return false;
    }

    const data = await res.json();
    setUser(data);
    return true;
  } catch (err) {
    console.error("Registration failed:", err);
    return false;
  }
};
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
