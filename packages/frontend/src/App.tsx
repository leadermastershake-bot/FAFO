import { useState } from 'react';
import './App.css'
import { SetupWizard } from './components/SetupWizard'
import { Wallet } from './components/Wallet'
import { Trading } from './components/Trading'
import { AuctionHouse } from './components/AuctionHouse'
import { AuctionDetails } from './components/AuctionDetails'
import { DatabaseWizard } from './components/DatabaseWizard'
import { AITradeSuggestions } from './components/AITradeSuggestions'
import { AIPersonalizationWizard } from './components/AIPersonalizationWizard'
import { AIDailyBrief } from './components/AIDailyBrief'
import Portfolio from './components/Portfolio'
import TradeHistory from './components/TradeHistory'

type View = 'trading' | 'auction-house' | 'auction-details' | 'ai-suggestions' | 'daily-brief' | 'portfolio' | 'trade-ledger';

function App() {
  const [currentView, setCurrentView] = useState<View>('auction-house');
  const [showAIPersonalization, setShowAIPersonalization] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'auction-house':
        return <AuctionHouse />;
      case 'auction-details':
        return <AuctionDetails />;
      case 'ai-suggestions':
        return <AITradeSuggestions />;
      case 'daily-brief':
        return <AIDailyBrief />;
      case 'portfolio':
        return <Portfolio />;
      case 'trade-ledger':
        return <TradeHistory />;
      case 'trading':
      default:
        return <Trading />;
    }
  };

  return (
    <div className="app-container">
      {showAIPersonalization && <AIPersonalizationWizard />}
      <DatabaseWizard />
      <SetupWizard />
      <header className="app-header">
        <h1>METABOTPRIME vNext</h1>
        <nav>
          <button onClick={() => setCurrentView('auction-house')}>Auction House</button>
          <button onClick={() => setCurrentView('auction-details')}>Auction Details</button>
          <button onClick={() => setCurrentView('ai-suggestions')}>AI Suggestions</button>
          <button onClick={() => setCurrentView('daily-brief')}>Your Daily Brief</button>
          <button onClick={() => setCurrentView('portfolio')}>Portfolio</button>
          <button onClick={() => setCurrentView('trade-ledger')}>Trade Ledger</button>
          <button onClick={() => setCurrentView('trading')}>Trading</button>
          <button onClick={() => setShowAIPersonalization(true)}>Personalize AI</button>
        </nav>
      </header>
      <main className="app-main">
        <Wallet />
        {renderView()}
      </main>
      <footer className="app-footer">
        <p>Status: Connected</p>
      </footer>
    </div>
  )
}

export default App
