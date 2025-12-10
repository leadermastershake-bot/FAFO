import { marketDataService, type MarketData } from './marketDataService';

export type AgentStatus = 'active' | 'working' | 'error' | 'paused';
export type AgentSignal = 'buy' | 'sell' | 'hold' | null;

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  output: string;
  signal: AgentSignal;
}

const AGENT_ROLES = {
  DATA_ANALYSIS: 'Data Analysis',
  RISK_ASSESSMENT: 'Risk Assessment',
  STRATEGY_DEVELOPMENT: 'Strategy Development',
  TRADE_EXECUTION: 'Trade Execution',
  SYSTEM_MONITORING: 'System Monitoring',
  COMPLIANCE: 'Compliance',
  LEAD_ADJUDICATOR: 'Lead Adjudicator',
};

class AgentService {
  public agents: Agent[] = [];
  private subscribers: ((agents: Agent[]) => void)[] = [];
  private priceHistory: number[] = [];
  private static readonly SHORT_PERIOD = 5;
  private static readonly LONG_PERIOD = 10;

  constructor() {
    this.agents = [
      { id: 'data', name: 'Alpha', role: AGENT_ROLES.DATA_ANALYSIS, status: 'active', output: 'Waiting for data...', signal: null },
      { id: 'risk', name: 'Beta', role: AGENT_ROLES.RISK_ASSESSMENT, status: 'active', output: 'Volatility: N/A', signal: null },
      { id: 'strategy', name: 'Gamma', role: AGENT_ROLES.STRATEGY_DEVELOPMENT, status: 'active', output: 'No signal', signal: null },
      { id: 'execution', name: 'Delta', role: AGENT_ROLES.TRADE_EXECUTION, status: 'paused', output: 'Awaiting signal', signal: null },
      { id: 'monitoring', name: 'Epsilon', role: AGENT_ROLES.SYSTEM_MONITORING, status: 'active', output: 'System OK', signal: null },
      { id: 'compliance', name: 'Zeta', role: AGENT_ROLES.COMPLIANCE, status: 'active', output: 'All clear', signal: null },
      { id: 'adjudicator', name: 'Omega', role: AGENT_ROLES.LEAD_ADJUDICATOR, status: 'active', output: 'No conflicts', signal: null },
    ];

    marketDataService.subscribe(this.handleMarketData.bind(this));
  }

  private handleMarketData(data: MarketData) {
    this.priceHistory.push(data.price);
    if (this.priceHistory.length > AgentService.LONG_PERIOD) {
      this.priceHistory.shift();
    }

    this.runDataAnalysis(data.price);
    this.runStrategyDevelopment();

    this.notifySubscribers();
  }

  private runDataAnalysis(price: number) {
      const dataAgent = this.getAgent('data');
      if (dataAgent) {
        if (this.priceHistory.length >= AgentService.LONG_PERIOD) {
            const shortMA = this.calculateMA(AgentService.SHORT_PERIOD);
            const longMA = this.calculateMA(AgentService.LONG_PERIOD);
            dataAgent.output = `SMA(${AgentService.SHORT_PERIOD}): ${shortMA.toFixed(2)}, SMA(${AgentService.LONG_PERIOD}): ${longMA.toFixed(2)}`;
        } else {
            dataAgent.output = `Price: ${price.toFixed(2)} (gathering history...)`;
        }
      }
  }

  private runStrategyDevelopment() {
      const strategyAgent = this.getAgent('strategy');
      if (strategyAgent && this.priceHistory.length >= AgentService.LONG_PERIOD) {
        const shortMA = this.calculateMA(AgentService.SHORT_PERIOD);
        const longMA = this.calculateMA(AgentService.LONG_PERIOD);

        if (shortMA > longMA) {
            strategyAgent.signal = 'buy';
            strategyAgent.output = 'Bullish crossover';
        } else if (shortMA < longMA) {
            strategyAgent.signal = 'sell';
            strategyAgent.output = 'Bearish crossover';
        } else {
            strategyAgent.signal = 'hold';
            strategyAgent.output = 'No clear signal';
        }
      }
  }

  private calculateMA(period: number): number {
    const relevantHistory = this.priceHistory.slice(-period);
    const sum = relevantHistory.reduce((a, b) => a + b, 0);
    return sum / relevantHistory.length;
  }

  private getAgent(id: string): Agent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  subscribe(callback: (agents: Agent[]) => void): void {
    this.subscribers.push(callback);
    callback(this.agents);
  }

  unsubscribe(callback: (agents: Agent[]) => void): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(sub => sub(this.agents));
  }
}

export const agentService = new AgentService();
