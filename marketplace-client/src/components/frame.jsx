import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { Box, Toolbar } from '@mui/material';

const Frame = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }} className="frame">
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <div className="content">
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default Frame;