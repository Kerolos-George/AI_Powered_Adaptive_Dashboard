import React, { useRef } from 'react';
import '../styles/FileUpload.css';

const FileUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const schema = JSON.parse(e.target.result);
          onUpload(schema);
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid JSON schema.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
      <button 
        className="upload-btn"
        onClick={() => fileInputRef.current.click()}
      >
        Upload Schema
      </button>
    </div>
  );
};

export default FileUpload; 