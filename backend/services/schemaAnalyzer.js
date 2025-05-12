const _ = require('lodash');

class SchemaAnalyzer {
  /**
   * Analyze the input JSON schema and detect modules
   * @param {Object} jsonSchema - The input JSON schema to analyze
   * @returns {Array} List of detected modules with their fields
   */
  static analyzeSchema(jsonSchema) {
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      throw new Error('Invalid JSON schema');
    }

    const detectedModules = [];

    // Iterate through each collection/key in the schema
    Object.keys(jsonSchema).forEach(collectionName => {
      const collection = jsonSchema[collectionName];

      // Ensure collection is an array and has at least one item
      if (!Array.isArray(collection) || collection.length === 0) return;

      // Get sample item to analyze fields
      const sampleItem = collection[0];
      
      // Determine module name (capitalize first letter)
      const moduleName = this.formatModuleName(collectionName);

      // Extract fields from sample item
      const fields = this.extractFields(sampleItem);

      // Calculate confidence score based on field completeness
      const confidenceScore = this.calculateConfidenceScore(collection, fields);

      detectedModules.push({
        module: moduleName,
        collection: collectionName,
        fields,
        confidenceScore
      });
    });

    return detectedModules;
  }

  /**
   * Extract fields from a sample item
   * @param {Object} sampleItem - Sample item to extract fields from
   * @returns {Array} List of fields with their names and types
   */
  static extractFields(sampleItem) {
    return Object.keys(sampleItem).map(field => ({
      name: field,
      type: this.determineFieldType(sampleItem[field])
    }));
  }

  /**
   * Determine the type of a field with more granularity
   * @param {*} value - Value to determine type for
   * @returns {string} Detailed type of the value
   */
  static determineFieldType(value) {
    if (value === null) return 'null';
    
    const type = typeof value;
    
    // More specific type checking
    switch(type) {
      case 'number':
        return Number.isInteger(value) ? 'integer' : 'float';
      case 'object':
        if (Array.isArray(value)) return 'array';
        if (value instanceof Date) return 'date';
        return 'object';
      default:
        return type;
    }
  }

  /**
   * Calculate confidence score based on field completeness
   * @param {Array} collection - Collection of items
   * @param {Array} fields - List of fields
   * @returns {number} Confidence score (0-100)
   */
  static calculateConfidenceScore(collection, fields) {
    // Check completeness across all items
    const completenessScores = collection.map(item => {
      const completedFields = fields.filter(field => 
        item[field.name] !== undefined && 
        item[field.name] !== null && 
        item[field.name] !== ''
      ).length;
      
      return (completedFields / fields.length) * 100;
    });

    // Average completeness score
    return _.mean(completenessScores) || 0;
  }

  /**
   * Format module name (capitalize first letter)
   * @param {string} name - Collection name
   * @returns {string} Formatted module name
   */
  static formatModuleName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

module.exports = SchemaAnalyzer;