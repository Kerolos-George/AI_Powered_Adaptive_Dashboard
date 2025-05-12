import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeSchema = async (jsonSchema) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-schema`, jsonSchema);
    return response.data;
  } catch (error) {
    console.error('Error analyzing schema:', error);
    throw error;
  }
};