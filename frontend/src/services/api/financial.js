// API service for financial endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const financialApi = {
  // Get health score
  async getHealthScore() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/financial/health-score`);
      if (!response.ok) throw new Error('Failed to fetch health score');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Analyze financial data
  async analyzeFinancialData(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/financial/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to analyze data');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};