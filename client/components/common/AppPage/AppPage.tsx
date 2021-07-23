import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';

const AppPage: React.FC = ({ children, ...containerProps }) => {
  return (
    <div
      {...containerProps}
      style={{
        minHeight: '100vh',
      }}
    >
      <NavigationBar />
      {children}
    </div>
  );
};

export default AppPage;
