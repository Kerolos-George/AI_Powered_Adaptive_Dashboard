const express = require('express');
const SchemaAnalyzer = require('../services/schemaAnalyzer');
const AISuggestionGenerator = require('../services/aiSuggestionGenerator');
const router = express.Router();



router.post('/analyze-schema', (req, res) => {
  try {
    const jsonSchema = req.body;

    // Analyze schema and detect modules
    const detectedModules = SchemaAnalyzer.analyzeSchema(jsonSchema);

    // Generate AI suggestions
    const aiSuggestions = AISuggestionGenerator.generateSuggestions(
      jsonSchema, 
      detectedModules
    );

    res.json({
      modules: detectedModules,
      suggestions: aiSuggestions
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Schema analysis failed', 
      message: error.message 
    });
  }
});

module.exports = router;