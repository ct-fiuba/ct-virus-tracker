const Visit = require('../schemas/Visit');

module.exports = function VisitHandler() {

  const detectVisit = async (code) => 
    Visit.updateOne({ userGeneratedCode: code }, { detectedTimestamp: Date.now() });

  return {
    detectVisit
  };
};
