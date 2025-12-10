import React, { useState } from 'react';
import './LoginScreen.css';

interface LoginScreenProps {
  onLogin: (username: string, accessLevel: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('user');

  const handleLogin = () => {
    // Basic validation
    if (username.trim() && password.trim()) {
      onLogin(username, accessLevel);
    }
  };

  return (
    <div id="login-screen">
      <div className="login-form">
        <h2>🤖 METABOTPRIME v6.2</h2>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Access Level:</label>
          <select
            id="access-level"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
          >
            <option value="user">Standard User</option>
            <option value="admin">Administrator</option>
            <option value="superadmin">Super Administrator</option>
          </select>
        </div>
        <button onClick={handleLogin} className="primary">🔐 LOGIN</button>
        <button onClick={() => alert('Access request feature coming soon!')}>📝 REQUEST ACCESS</button>
        <div style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>
          Super Admin: LMS only<br />
          v6.2: Enhanced LLM Integration
        </div>
      </div>
    </div>
  );
};