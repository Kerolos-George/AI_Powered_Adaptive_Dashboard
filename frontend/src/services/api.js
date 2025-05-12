const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeSchema = async (schema) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema),
    });
    return await response.json();
  } catch (error) {
    console.error('Error analyzing schema:', error);
    throw error;
  }
};

export const getModuleData = async (moduleName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleName}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${moduleName} data:`, error);
    throw error;
  }
};

export const getAISuggestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-suggestions`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    throw error;
  }
}; 