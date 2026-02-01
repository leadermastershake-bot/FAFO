import React from 'react';

const ControlPanel = ({ indicators, onIndicatorChange, onTimelineChange, onTradingPairChange }) => {
  return (
    <div className="control-panel">
      <h3>Trading Pair</h3>
      <select onChange={e => onTradingPairChange(e.target.value)}>
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
      </select>
      <h3>Technical Indicators</h3>
      {Object.keys(indicators).map(indicator => (
        <div key={indicator}>
          <input
            type="checkbox"
            id={indicator}
            name={indicator}
            checked={indicators[indicator]}
            onChange={() => onIndicatorChange(indicator)}
          />
          <label htmlFor={indicator}>{indicator.toUpperCase()}</label>
        </div>
      ))}
      <h3>Timeline</h3>
      <select onChange={e => onTimelineChange(e.target.value)}>
        <option value="7">7 Days</option>
        <option value="30">30 Days</option>
        <option value="90">90 Days</option>
      </select>
    </div>
  );
};

export default ControlPanel;
