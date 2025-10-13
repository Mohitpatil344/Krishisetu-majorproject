// src/contexts/RoleContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  // Save role to localStorage whenever it changes
  const updateRole = (role) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  // Clear role (for logout)
  const clearRole = () => {
    setSelectedRole(null);
    localStorage.removeItem('selectedRole');
  };

  const value = {
    selectedRole,
    setSelectedRole: updateRole,
    clearRole,
    isRoleSelected: !!selectedRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export default RoleContext;
