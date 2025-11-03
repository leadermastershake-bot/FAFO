import { useState } from 'react';
import './App.css'
import { SetupWizard } from './components/SetupWizard'
import { Wallet } from './components/Wallet'
import { Trading } from './components/Trading'
import { AuctionHouse } from './components/AuctionHouse'
import { AuctionDetails } from './components/AuctionDetails'

type View = 'trading' | 'auction-house' | 'auction-details';

function App() {
  const [currentView, setCurrentView] = useState<View>('auction-house');

  const renderView = () => {
    switch (currentView) {
      case 'auction-house':
        return <AuctionHouse />;
      case 'auction-details':
        return <AuctionDetails />;
      case 'trading':
      default:
        return <Trading />;
    }
  };

  return (
    <div className="app-container">
      <SetupWizard />
      <header className="app-header">
        <h1>METABOTPRIME vNext</h1>
        <nav>
          <button onClick={() => setCurrentView('auction-house')}>Auction House</button>
          <button onClick={() => setCurrentView('auction-details')}>Auction Details</button>
          <button onClick={() => setCurrentView('trading')}>Trading</button>
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
