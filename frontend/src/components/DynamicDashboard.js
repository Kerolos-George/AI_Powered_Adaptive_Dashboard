import React, { useState, useEffect } from 'react';
import ModuleCard from './ModuleCard';
import AISuggestions from './AISuggestions';
import { analyzeSchema, getModuleData, getAISuggestions } from '../services/api';

const DynamicDashboard = () => {
  const [modules, setModules] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Sample schema - in real app, this would come from user upload
        const sampleSchema = {
          orders: [
            { id: 1, total: 150, status: 'completed' },
            { id: 2, total: 200, status: 'pending' }
          ],
          inventory: [
            { name: 'Item 1', stock: 5 },
            { name: 'Item 2', stock: 15 }
          ],
          reviews: [
            { rating: 4, comment: 'Great service!' },
            { rating: 5, comment: 'Excellent experience' }
          ]
        };

        // Analyze schema and get modules
        const detectedModules = await analyzeSchema(sampleSchema);
        setModules(detectedModules);

        // Fetch data for each module
        const data = {};
        for (const module of detectedModules) {
          data[module.module.toLowerCase()] = await getModuleData(module.module);
        }
        setModuleData(data);

        // Get AI suggestions
        const aiSuggestions = await getAISuggestions();
        setSuggestions(aiSuggestions);

        setLoading(false);
      } catch (err) {
        setError('Failed to initialize dashboard');
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-error">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="card mb-4">
        <h1>Dynamic Dashboard</h1>
        <p>Adaptive dashboard based on your data structure</p>
      </header>

      <div className="dashboard-grid">
        <div className="main-content">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              title={module.module}
              type={module.module.toLowerCase()}
              data={moduleData[module.module.toLowerCase()] || []}
            />
          ))}
        </div>

        <div className="sidebar">
          <AISuggestions suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
};

export default DynamicDashboard;