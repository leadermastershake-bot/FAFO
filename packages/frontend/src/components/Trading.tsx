// packages/frontend/src/components/Trading.tsx
import React from 'react';
import { VirtualizedCanvas } from './VirtualizedCanvas';

export function Trading() {
  return (
    <div className="trading-container">
      <h2>AI Trading Terminal</h2>
      <VirtualizedCanvas />
    </div>
  );
}
