// src/App.tsx
import React, { useState } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/layout/DashboardLayout';

const App: React.FC = () => {
  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle logout
  const handleLogout = () => setIsLoggedIn(false);

  // Handle login (called from Login.tsx)
  const handleLogin = () => setIsLoggedIn(true);

  return (
    <div className="h-screen w-screen">
      {isLoggedIn ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
