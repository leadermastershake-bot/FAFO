import { useState } from 'react';
import './App.css';
import { LoginScreen } from './components/LoginScreen';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <DashboardLayout />
      )}
    </div>
  );
}

export default App;
