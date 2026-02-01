// packages/frontend/src/services/aiService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Fetches a trade suggestion from the backend.
 * @param marketData - The market data to be analyzed.
 * @returns The trade suggestion from the model.
 */
export async function getTradeSuggestion(marketData: any): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/trade-suggestion`, { marketData });
    return response.data;
  } catch (error) {
    console.error('Error fetching trade suggestion:', error);
    throw new Error('Failed to get trade suggestion.');
  }
}

/**
 * Validates a proposed action with the backend.
 * @param actionDetails - The details of the action to be validated.
 * @returns The validation result from the model.
 */
export async function validateAction(actionDetails: any): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate-action`, { actionDetails });
    return response.data;
  } catch (error) {
    console.error('Error validating action:', error);
    throw new Error('Failed to validate action.');
  }
}
