import axios from 'axios';

// External API service for location data (via Next.js API route to avoid CORS)
export const externalLocationAPI = {
  checkLocation: async (cityName: string, countryID: string) => {
    try {
      const response = await axios.get('/api/check-location', {
        params: {
          cityName,
          countryID,
        },
      });

      return response.data?.location;
    } catch (error: any) {
      console.error('Error checking external location:', error);
      throw error;
    }
  },
};
