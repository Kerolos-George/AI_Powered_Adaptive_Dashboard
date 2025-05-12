import React, { useState } from 'react';
import { analyzeSchema } from '../services/apiService';
import ModuleCard from './ModuleCard';
import FileUpload from './FileUpload';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSchemaUpload = async (schema) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeSchema(schema);
      setModules(result.modules);
      setSuggestions(result.suggestions);
    } catch (err) {
      setError('Failed to analyze schema. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div key={suggestion.category} className={`suggestion-card ${suggestion.type}`}>
        <div className="suggestion-header">
          <span className="suggestion-category">{suggestion.category}</span>
          <span className="suggestion-type">{suggestion.type}</span>
        </div>
        <p className="suggestion-message">{suggestion.message}</p>
        {suggestion.details && (
          <ul className="suggestion-details">
            {suggestion.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Adaptive Dashboard</h1>
        <FileUpload onUpload={handleSchemaUpload} />
      </header>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Analyzing schema...</div>
      ) : (
        <>
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <h2>AI Insights</h2>
              <div className="suggestions-grid">
                {suggestions.map(renderSuggestion)}
              </div>
            </div>
          )}

          <div className="modules-grid">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                moduleName={module.module}
                fields={module.fields.map(field => field.name)}
                confidence={module.confidenceScore}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 