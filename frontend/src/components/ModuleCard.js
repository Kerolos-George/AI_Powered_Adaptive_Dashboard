import React from 'react';
import '../styles/ModuleCard.css';

const ModuleCard = ({ moduleName, fields, confidence }) => {
  return (
    <div className="module-card">
      <div className="module-header">
        <h3>{moduleName}</h3>
        <div className="confidence-score">
          Confidence: {confidence}%
        </div>
      </div>
      
      <div className="module-content">
        <h4>Available Fields:</h4>
        <ul className="fields-list">
          {fields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </div>

      <div className="module-footer">
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default ModuleCard;