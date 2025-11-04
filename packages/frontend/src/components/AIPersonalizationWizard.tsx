import React, { useState } from 'react';
import './AIPersonalizationWizard.css';

export function AIPersonalizationWizard() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [riskAppetite, setRiskAppetite] = useState('');
  const [ambition, setAmbition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will save the user's preferences to the backend
    console.log({ name, riskAppetite, ambition });
    alert("Your profile has been forged. The AI is now your ally.");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>What Should We Call You, Pioneer?</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            <button onClick={() => setStep(2)}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>How Bold Is Your Ambition?</h2>
            <div className="options-grid">
              <button onClick={() => { setRiskAppetite('conservative'); setStep(3); }}>Cautious Guardian</button>
              <button onClick={() => { setRiskAppetite('balanced'); setStep(3); }}>Calculated Strategist</button>
              <button onClick={() => { setRiskAppetite('aggressive'); setStep(3); }}>Fearless Voyager</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>What Is Your Ultimate Goal?</h2>
            <div className="options-grid">
              <button onClick={() => { setAmbition('wealth'); handleSubmit(e); }}>Build Generational Wealth</button>
              <button onClick={() => { setAmbition('freedom'); handleSubmit(e); }}>Achieve Financial Freedom</button>
              <button onClick={() => { setAmbition('power'); handleSubmit(e); }}>Become a Market Mover</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-container ai-wizard">
        {renderStep()}
      </div>
    </div>
  );
}
