import './App.css'
import React, { useState, useEffect } from 'react';
import { SetupWizard } from './components/SetupWizard'
import { Wallet } from './components/Wallet'
import { Trading } from './components/Trading'
import ChartComponent from './components/ChartComponent'
import ControlPanel from './components/ControlPanel'
import axios from 'axios';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    bollinger_bands: false,
  });
  const [timeline, setTimeline] = useState('30');
  const [chartData, setChartData] = useState([]);
  const [signal, setSignal] = useState('hold');
  const [volatility, setVolatility] = useState(null);
  const [tradingPair, setTradingPair] = useState('bitcoin');

  const handleIndicatorChange = (indicator) => {
    setIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }));
  };

  const handleTimelineChange = (newTimeline) => {
    setTimeline(newTimeline);
  };

  const handleTradingPairChange = (newTradingPair) => {
    setTradingPair(newTradingPair);
  };

  const handleConfigurationSuccess = () => {
    setIsConfigured(true);
  };

  useEffect(() => {
    const fetchSignal = async () => {
      if (!isConfigured) return;
      try {
        const activeIndicators = Object.keys(indicators).filter(key => indicators[key]);
        const response = await axios.post('/api/signal', {
          coin_id: tradingPair,
          vs_currency: 'usd',
          days: timeline,
          indicators: activeIndicators,
        });
        setSignal(response.data.signal);
      } catch (error) {
        console.error('Error fetching trading signal:', error);
      }
    };

    fetchSignal();
  }, [indicators, timeline, isConfigured]);

    useEffect(() => {
        if (!isConfigured) return;

        const fetchMarketData = async () => {
            try {
                const response = await axios.post('/api/market_data', {
                    coin_id: tradingPair,
                    vs_currency: 'usd',
                    days: timeline,
                });
                setChartData(response.data.marketData.prices);
            } catch (error) {
                console.error('Error fetching market data:', error);
            }
        };

        fetchMarketData();
    }, [timeline, isConfigured]);

    useEffect(() => {
        if (!isConfigured) return;

        const fetchVolatility = async () => {
            try {
                const response = await axios.post('/api/volatility', {
                    coin_id: tradingPair,
                    vs_currency: 'usd',
                });
                setVolatility(response.data.volatility);
            } catch (error) {
                console.error('Error fetching volatility:', error);
            }
        };

        fetchVolatility();
    }, [isConfigured]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await axios.get('/api/status');
                setIsConfigured(response.data.isConfigured);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };
        checkStatus();
    }, []);

  return (
    <div className="app-container">
      <SetupWizard onConfigurationSuccess={handleConfigurationSuccess} />
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
        <Wallet isConfigured={isConfigured} />
        <Trading />
        <div className="ai-core-container">
            <ControlPanel
                indicators={indicators}
                onIndicatorChange={handleIndicatorChange}
                onTimelineChange={handleTimelineChange}
                onTradingPairChange={handleTradingPairChange}
            />
            <ChartComponent chartData={chartData} />
            <div className="signal-display">
                <h2>Current Signal: {signal.toUpperCase()}</h2>
                {volatility && <p>Volatility: {volatility.toFixed(4)}</p>}
            </div>
        </div>
      </main>
      <footer className="app-footer">
        <p>Status: Connected</p>
      </footer>
    </div>
  )
}

export default App
