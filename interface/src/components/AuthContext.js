import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const setSuccessMessage = (message) => {
    setMessage(message);
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <AuthContext.Provider value={{ message, setSuccessMessage, clearMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
