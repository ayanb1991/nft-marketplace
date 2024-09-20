import React, { createContext, useState } from 'react';
import AlertComponent from '../components/alert';

const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  
  const [alertConfig, set_alertConfig] = useState({
    message: "",
    severity: "success",
  });

  const showAlert = (config) => {
    set_alertConfig(config);
  };

  const hideAlert = () => {
    set_alertConfig({
      message: "",
      severity: "success",
    });
  };

  const value = {
    showAlert,
    hideAlert
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertComponent 
        open={Boolean(alertConfig.message)}
        onClose={hideAlert}
        message={alertConfig.message}
        severity={alertConfig.severity}
      />
    </AlertContext.Provider>
  );
};

export default AlertContext;
