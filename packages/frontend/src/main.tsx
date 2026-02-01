import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MarketDataProvider } from './contexts/MarketDataContext.tsx';
import { AgentProvider } from './contexts/AgentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MarketDataProvider>
      <AgentProvider>
        <App />
      </AgentProvider>
    </MarketDataProvider>
  </StrictMode>,
);
