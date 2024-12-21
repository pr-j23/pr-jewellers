import React, { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const location = useLocation();

  const renderMetalPrices = useMemo(
    () => ["/", "/products", "/category"].includes(location.pathname),
    [location.pathname]
  );

  const contextValue = useMemo(
    () => ({ renderMetalPrices }),
    [renderMetalPrices]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalValue = () => useContext(GlobalContext);
