import React, { createContext, useState, useCallback } from "react";
import FullPageLoader from "../components/loader";

const LoaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {
  const [isLoaderVisible, set_isLoaderVisible] = useState(false);

  const showLoader = useCallback((config) => {
    set_isLoaderVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    set_isLoaderVisible(false);
  }, []);

  const value = {
    showLoader,
    hideLoader,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {isLoaderVisible ? <FullPageLoader /> : null}
    </LoaderContext.Provider>
  );
};

export default LoaderContext;
