// AICoreService.ts
import axios from 'axios';

// The base URL for the Python model-service
const MODEL_SERVICE_BASE_URL = 'http://localhost:5001';

class AICoreService {
  /**
   * Fetches a trade suggestion from the model-service.
   * @param marketData - The market data to be analyzed.
   * @returns The trade suggestion from the model.
   */
  async getTradeSuggestion(marketData: any): Promise<any> {
    try {
      const response = await axios.post(`${MODEL_SERVICE_BASE_URL}/suggest`, { market_data: marketData });
      return response.data;
    } catch (error) {
      console.error('Error fetching trade suggestion:', error);
      throw new Error('Failed to get trade suggestion from the model service.');
    }
  }

  /**
   * Validates a proposed action with the model-service.
   * @param actionDetails - The details of the action to be validated.
   * @returns The validation result from the model.
   */
  async validateAction(actionDetails: any): Promise<any> {
    try {
      const response = await axios.post(`${MODEL_SERVICE_BASE_URL}/validate`, { action_details: actionDetails });
      return response.data;
    } catch (error) {
      console.error('Error validating action:', error);
      throw new Error('Failed to validate action with the model service.');
    }
  }
}

export const aiCoreService = new AICoreService();
