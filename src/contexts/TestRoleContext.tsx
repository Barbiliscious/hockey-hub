import { createContext, useContext, useState, ReactNode } from "react";
import type { Role } from "@/lib/mockData";

interface TestRoleContextType {
  testRole: Role;
  setTestRole: (role: Role) => void;
}

const TestRoleContext = createContext<TestRoleContextType | undefined>(undefined);

export function TestRoleProvider({ children }: { children: ReactNode }) {
  const [testRole, setTestRole] = useState<Role>("PLAYER");
  
  return (
    <TestRoleContext.Provider value={{ testRole, setTestRole }}>
      {children}
    </TestRoleContext.Provider>
  );
}

export function useTestRole() {
  const context = useContext(TestRoleContext);
  if (!context) {
    throw new Error("useTestRole must be used within TestRoleProvider");
  }
  return context;
}
