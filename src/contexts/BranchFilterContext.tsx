import { createContext, useContext, useState, ReactNode } from "react";

interface BranchFilterContextType {
  selectedBranch: string; // "" means "All Branches"
  setSelectedBranch: (branch: string) => void;
}

const BranchFilterContext = createContext<BranchFilterContextType | undefined>(undefined);

export function BranchFilterProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState("");

  return (
    <BranchFilterContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </BranchFilterContext.Provider>
  );
}

export function useBranchFilter() {
  const context = useContext(BranchFilterContext);
  if (!context) throw new Error("useBranchFilter must be used within BranchFilterProvider");
  return context;
}
