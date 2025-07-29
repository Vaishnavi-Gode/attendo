import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USER_ROLE, STORAGE_KEYS, DEFAULT_CREDENTIALS } from "@constants";
import { studentsService, teachersService } from "@services/baseService";

//To share authentication state to all components
const AuthContext = createContext();

//Authenticate role
const findUser = async (email, password, role) => {
  if (
    role === USER_ROLE.ADMIN &&
    email === DEFAULT_CREDENTIALS.ADMIN.email &&
    password === DEFAULT_CREDENTIALS.ADMIN.password
  ) {
    return { id: "admin", email, firstName: "Admin", lastName: "User", role };
  }

  const service =
    role === USER_ROLE.STUDENT ? studentsService : teachersService;
  const users = await service.getAll();
  const user = users.find((u) => u.email === email && u.password === password);
  return user ? { ...user, role } : null;
};

//Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Authenticated User
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password, role) => {
    const foundUser = await findUser(email, password, role);
    if (!foundUser) throw new Error("Invalid email or password");

    setUser(foundUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
    navigate(`/${role}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate("/");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  // Providing auth context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { USER_ROLE };
