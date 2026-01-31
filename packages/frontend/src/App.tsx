import './App.css'
import { SetupWizard } from './components/SetupWizard'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { MarketDataProvider } from './contexts/MarketDataContext'

function App() {
  return (
    <div className="app-container">
      <MarketDataProvider>
        <SetupWizard />
        <DashboardLayout />
      </MarketDataProvider>
    </div>
  )
}

export default App
