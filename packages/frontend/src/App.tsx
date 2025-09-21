import './App.css'
import { SetupWizard } from './components/SetupWizard'
import { Wallet } from './components/Wallet'
import { Trading } from './components/Trading'

function App() {
  return (
    <div className="app-container">
      <SetupWizard />
      <header className="app-header">
        <h1>METABOTPRIME vNext</h1>
        <nav>
          <span>Dashboard</span>
          <span>Agents</span>
          <span>Wallets</span>
          <span>Settings</span>
        </nav>
      </header>
      <main className="app-main">
        <Wallet />
        <Trading />
        {/* The main content of the application will go here */}
        <p>Welcome to the future of AI-powered trading.</p>
      </main>
      <footer className="app-footer">
        <p>Status: Connected</p>
      </footer>
    </div>
  )
}

export default App
