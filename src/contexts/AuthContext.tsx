"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

type AuthContextType = ReturnType<typeof useAuth> & { isReadOnly: boolean };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, setUser } = useAuth();
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (user?.email === "demo1@hackathonmanagementweb.com") {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, isReadOnly }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
