import React from 'react';
import Header from './header';
import Sidebar from './sidebar';

const Frame = ({ children }) => {
  return (
    <div className="frame">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content" style={{marginLeft: "240px", padding: "15px"}}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Frame;