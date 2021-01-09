const Visit = require('../schemas/Visit');

module.exports = function VisitHandler() {

  const detectVisits = async (visits) => {

    const userCodes = visits.map(visit => visit.userGeneratedCode)

    return Visit.updateMany({ userGeneratedCode: { $in: userCodes } }, { detectedTimestamp: Date.now() })
  };

  return {
    detectVisits
  };
};
