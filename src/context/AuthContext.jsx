import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLE, STORAGE_KEYS, DEFAULT_CREDENTIALS } from '@constants';
import { studentsService, teachersService } from '@services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      let foundUser = null;
      
      // Check admin credentials
      if (role === USER_ROLE.ADMIN && email === DEFAULT_CREDENTIALS.ADMIN.email && password === DEFAULT_CREDENTIALS.ADMIN.password) {
        foundUser = {
          id: 'admin',
          email: DEFAULT_CREDENTIALS.ADMIN.email,
          firstName: 'Admin',
          lastName: 'User',
          role: USER_ROLE.ADMIN
        };
      } else {
        // Get users from API
        if (role === USER_ROLE.STUDENT) {
          const students = await studentsService.getAll();
          foundUser = students.find(s => s.email === email && s.password === password);
          if (foundUser) foundUser.role = USER_ROLE.STUDENT;
        } else if (role === USER_ROLE.TEACHER) {
          const teachers = await teachersService.getAll();
          foundUser = teachers.find(t => t.email === email && t.password === password);
          if (foundUser) foundUser.role = USER_ROLE.TEACHER;
        }
      }
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const user = {
        ...foundUser,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      // Navigate based on role
      if (user.role === USER_ROLE.ADMIN) navigate('/admin');
      else if (user.role === USER_ROLE.TEACHER) navigate('/teacher');
      else if (user.role === USER_ROLE.STUDENT) navigate('/student');
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    navigate('/');
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { USER_ROLE };