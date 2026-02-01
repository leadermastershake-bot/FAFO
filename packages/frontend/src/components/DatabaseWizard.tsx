import React, { useState } from 'react';
import './DatabaseWizard.css';

interface DatabaseWizardProps {
  onConfigure: (databaseUrl: string) => Promise<void>;
  isLoading: boolean;
}

export const DatabaseWizard: React.FC<DatabaseWizardProps> = ({ onConfigure, isLoading }) => {
  const [databaseUrl, setDatabaseUrl] = useState('mongodb://localhost:27017/metabotprime');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigure(databaseUrl);
  };

  return (
    <div className="database-wizard-overlay">
      <div className="database-wizard-modal">
        <h3>Database Configuration Required</h3>
        <p>
          The application backend failed to connect to the database. Please provide a valid
          MongoDB connection string to proceed.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="databaseUrl">MongoDB Connection String:</label>
            <input
              id="databaseUrl"
              type="text"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="mongodb://user:pass@host:port/db"
            />
          </div>
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Save and Connect'}
          </button>
        </form>
      </div>
    </div>
  );
};
