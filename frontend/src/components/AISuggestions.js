import React from 'react';

const AISuggestions = ({ suggestions }) => {
  return (
    <div className="card ai-suggestions">
      <h2>AI Insights</h2>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div className="suggestion-icon">
              {suggestion.type === 'warning' ? '⚠️' : '💡'}
            </div>
            <div className="suggestion-content">
              <h3>{suggestion.title}</h3>
              <p>{suggestion.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;