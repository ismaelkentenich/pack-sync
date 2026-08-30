import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type HeaderHeightContextValue = {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
};

const HeaderHeightContext =
  createContext<HeaderHeightContextValue | null>(null);

type HeaderHeightProviderProps = {
  children: React.ReactNode;
};

export function HeaderHeightProvider({
  children,
}: HeaderHeightProviderProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  const value = useMemo(
    () => ({
      headerHeight,
      setHeaderHeight,
    }),
    [headerHeight],
  );

  return (
    <HeaderHeightContext.Provider value={value}>
      {children}
    </HeaderHeightContext.Provider>
  );
}

export function useHeaderHeight() {
  const context = useContext(HeaderHeightContext);

  if (!context) {
    throw new Error(
      "useHeaderHeight must be used within HeaderHeightProvider",
    );
  }

  return context;
}
