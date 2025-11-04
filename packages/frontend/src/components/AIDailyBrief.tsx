import React, { useState, useEffect } from 'react';
import './AIDailyBrief.css';

interface Brief {
  title: string;
  summary: string;
  actionableInsights: { token: string; suggestion: string; confidence: number }[];
}

export function AIDailyBrief() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In the future, this will fetch the brief based on the user's saved preferences
    const mockUserPreferences = { name: 'Pioneer', riskAppetite: 'aggressive' };

    fetch('/api/ai/daily-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUserPreferences),
    })
      .then(res => {
        if (!res.ok) throw new Error('The oracle is silent for now. Check back later.');
        return res.json();
      })
      .then(data => {
        setBrief(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="daily-brief-container">Consulting the oracle...</div>;
  if (error) return <div className="daily-brief-container error">{error}</div>;
  if (!brief) return null;

  return (
    <div className="daily-brief-container">
      <h2>{brief.title}</h2>
      <p className="summary">{brief.summary}</p>
      <h3>Your Actionable Insights:</h3>
      <div className="insights-list">
        {brief.actionableInsights.map((insight, index) => (
          <div key={index} className="insight-card">
            <h4>{insight.token}</h4>
            <p>{insight.suggestion}</p>
            <div className="confidence-meter">
              <div className="confidence-level" style={{ width: `${insight.confidence * 100}%` }}>
                {(insight.confidence * 100).toFixed(0)}% Confidence
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
