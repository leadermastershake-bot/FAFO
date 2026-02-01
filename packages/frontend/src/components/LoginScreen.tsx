import React, { useState } from 'react';
import './LoginScreen.css';

interface User {
  username: string;
  accessLevel: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('user');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, accessLevel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLogin({ username: data.username, accessLevel: data.accessLevel });

    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-screen-overlay">
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>🤖 METABOTPRIME v7.0</h2>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="access-level">Access Level:</label>
            <select id="access-level" value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
              <option value="superadmin">Super Administrator</option>
            </select>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="primary">🔐 LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
