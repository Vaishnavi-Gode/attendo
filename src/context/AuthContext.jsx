import React, { createContext, useContext, useState, useEffect } from 'react';

export const USER_ROLE = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      let foundUser = null;
      
      // Check admin credentials
      if (role === USER_ROLE.ADMIN && email === 'admin@example.com' && password === 'password') {
        foundUser = {
          id: 'admin',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: USER_ROLE.ADMIN
        };
      } else {
        // Get stored users from localStorage
        const students = JSON.parse(localStorage.getItem('attendo_students') || '[]');
        const teachers = JSON.parse(localStorage.getItem('attendo_teachers') || '[]');
        
        if (role === USER_ROLE.STUDENT) {
          foundUser = students.find(s => s.email === email && s.password === password);
          if (foundUser) foundUser.role = USER_ROLE.STUDENT;
        } else if (role === USER_ROLE.TEACHER) {
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
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
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