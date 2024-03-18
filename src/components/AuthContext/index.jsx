"use client";

import React, { createContext } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
