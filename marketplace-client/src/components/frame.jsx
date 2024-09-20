import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { Box, Toolbar } from "@mui/material";
import { AlertContextProvider } from "../context/alert.context";

const Frame = ({ children }) => {
  return (
    <AlertContextProvider>
      <Box sx={{ display: "flex" }} className="frame">
        <Header />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <div className="content">{children}</div>
        </Box>
      </Box>
    </AlertContextProvider>
  );
};

export default Frame;
