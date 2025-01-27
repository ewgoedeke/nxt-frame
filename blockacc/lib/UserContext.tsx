// lib/UserContext.tsx
import React, { createContext, useContext, ReactNode } from "react";

type UserContextType = {
  id: string;
  email: string;
} | null;

const UserContext = createContext<UserContextType>(null);

export const UserProvider = ({
  value,
  children,
}: {
  value: UserContextType;
  children: ReactNode;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};