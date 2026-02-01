// packages/backend/src/services/TribunalService.ts

// Define the possible decisions an agent can make
export type AgentDecision = 'buy' | 'sell' | 'hold';

// Define the structure of a single agent's opinion
export interface AgentOpinion {
  agentId: number;
  decision: AgentDecision;
  justification: string;
}

// Define the structure of the final tribunal result
export interface TribunalResult {
  finalDecision: AgentDecision;
  decisionCount: {
    buy: number;
    sell: number;
    hold: number;
  };
  opinions: AgentOpinion[];
}

/**
 * Simulates a tribunal of 7 AI agents to make a trading decision.
 */
export class TribunalService {
  private readonly numberOfAgents = 7;

  /**
   * Runs the tribunal to get a collective trading decision.
   * @returns A promise that resolves to the TribunalResult.
   */
  public async getTribunalDecision(): Promise<TribunalResult> {
    const opinions: AgentOpinion[] = [];

    // Simulate each agent's opinion
    for (let i = 1; i <= this.numberOfAgents; i++) {
      opinions.push(this.getAgentOpinion(i));
    }

    // Tally the votes
    const decisionCount = { buy: 0, sell: 0, hold: 0 };
    for (const opinion of opinions) {
      decisionCount[opinion.decision]++;
    }

    // Determine the final decision based on majority vote
    let finalDecision: AgentDecision = 'hold';
    if (decisionCount.buy > decisionCount.sell && decisionCount.buy > decisionCount.hold) {
      finalDecision = 'buy';
    } else if (decisionCount.sell > decisionCount.buy && decisionCount.sell > decisionCount.hold) {
      finalDecision = 'sell';
    }

    return {
      finalDecision,
      decisionCount,
      opinions,
    };
  }

  /**
   * Simulates a single agent's opinion.
   * In a real implementation, this would involve a complex model.
   * Here, we use simple randomized logic for demonstration.
   * @param agentId The ID of the agent.
   * @returns An AgentOpinion object.
   */
  private getAgentOpinion(agentId: number): AgentOpinion {
    const decisions: AgentDecision[] = ['buy', 'sell', 'hold'];
    const decision = decisions[Math.floor(Math.random() * decisions.length)];

    let justification = '';
    switch (decision) {
      case 'buy':
        justification = `Agent ${agentId}: Market indicators look bullish. Recommending a buy.`;
        break;
      case 'sell':
        justification = `Agent ${agentId}: Market is showing bearish signs. Recommending a sell.`;
        break;
      case 'hold':
        justification = `Agent ${agentId}: Market is uncertain. Recommending to hold.`;
        break;
    }

    return {
      agentId,
      decision,
      justification,
    };
  }
}
