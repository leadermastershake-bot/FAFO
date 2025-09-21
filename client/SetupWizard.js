import React, { useState } from 'react';
import './SetupWizard.css';

const SetupWizard = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState('mongodb');
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: 27017,
    name: 'metabotprime',
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleConfigChange = (e) => {
    setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
  };

  const finishSetup = () => {
    // In a real application, this would send the config to the backend
    console.log('Submitting configuration:', { dbType, dbConfig });
    onSetupComplete(); // Notify App component that setup is done
  };

  const renderDbConfigFields = () => {
    if (dbType === 'mongodb') {
      return (
        <>
          <div className="form-group">
            <label>Host:</label>
            <input name="host" value={dbConfig.host || ''} onChange={handleConfigChange} />
          </div>
          <div className="form-group">
            <label>Port:</label>
            <input name="port" type="number" value={dbConfig.port || ''} onChange={handleConfigChange} />
          </div>
          <div className="form-group">
            <label>Database Name:</label>
            <input name="name" value={dbConfig.name || ''} onChange={handleConfigChange} />
          </div>
        </>
      );
    }
    // Add similar blocks for postgresql and mysql if needed
    return null;
  };

  return (
    <div className="setup-wizard-overlay">
      <div className="setup-wizard-modal">
        {step === 1 && (
          <div className="wizard-step">
            <h2>Welcome to METABOTPRIME v7.0 Setup</h2>
            <p>This wizard will guide you through the initial configuration.</p>
            <p>Let's start by setting up your database connection.</p>
            <div className="wizard-nav">
              <button onClick={nextStep} className="primary">Start Setup</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h2>Step 2: Database Configuration</h2>
            <div className="form-group">
              <label>Database Type:</label>
              <select value={dbType} onChange={(e) => setDbType(e.target.value)}>
                <option value="mongodb">MongoDB (Recommended)</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>
            {renderDbConfigFields()}
            <div className="wizard-nav">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep} className="primary">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <h2>Step 3: Confirmation</h2>
            <p>Please review your configuration settings before proceeding.</p>
            <div className="config-summary">
              <div><strong>Database Type:</strong> {dbType}</div>
              <div><strong>Host:</strong> {dbConfig.host}</div>
              <div><strong>Port:</strong> {dbConfig.port}</div>
              <div><strong>Database Name:</strong> {dbConfig.name}</div>
            </div>
            <div className="wizard-nav">
              <button onClick={prevStep}>Back</button>
              <button onClick={finishSetup} className="primary">Finish Setup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;
