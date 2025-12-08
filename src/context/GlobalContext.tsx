import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type GlobalContextValue = {
  renderMetalPrices: boolean;
};

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

type GlobalProviderProps = {
  children: ReactNode;
};

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const location = useLocation();

  const renderMetalPrices = useMemo(
    () => ['/', '/products', '/category'].includes(location.pathname),
    [location.pathname]
  );

  const contextValue = useMemo<GlobalContextValue>(() => ({ renderMetalPrices }), [renderMetalPrices]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

export const useGlobalValue = (): GlobalContextValue => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalValue must be used within GlobalProvider');
  }
  return context;
};
