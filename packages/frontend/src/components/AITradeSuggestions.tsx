import React, { useState, useEffect } from 'react';
import './AITradeSuggestions.css';

interface Suggestion {
  action: 'BUY' | 'SELL';
  token: string;
  confidence: number;
  reason: string;
}

export function AITradeSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch AI-powered trade suggestions from our backend
    fetch('/api/ai/trade-suggestions', {
      method: 'POST', // The endpoint expects a POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market: 'crypto' }), // Example market data
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('The AI is currently recalibrating. Please check back for new insights.');
        }
        return res.json();
      })
      .then(data => {
        setSuggestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="ai-suggestions-container">Analyzing market data...</div>;
  }

  if (error) {
    return <div className="ai-suggestions-container error">{error}</div>;
  }

  return (
    <div className="ai-suggestions-container">
      <h2>AI Trade Signals: Your Unfair Advantage</h2>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`suggestion-card ${suggestion.action.toLowerCase()}`}>
            <div className="action-indicator">{suggestion.action}</div>
            <div className="token-info">
              <h3>{suggestion.token}</h3>
              <p><strong>Confidence:</strong> {(suggestion.confidence * 100).toFixed(0)}%</p>
            </div>
            <p className="reason">{suggestion.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
