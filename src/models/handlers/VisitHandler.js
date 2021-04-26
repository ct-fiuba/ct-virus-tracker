const Visit = require('../schemas/Visit');

module.exports = function VisitHandler() {

<<<<<<< HEAD
  const detectVisit = async (code) => 
    Visit.updateOne({ userGeneratedCode: code }, { detectedTimestamp: Date.now() });

  return {
    detectVisit
=======
  const detectVisits = async (visits) => {

    const userCodes = visits.map(visit => visit.userGeneratedCode)

    return Visit.updateMany({ userGeneratedCode: { $in: userCodes } }, { detectedTimestamp: Date.now() })
  };

  return {
    detectVisits
>>>>>>> 93ae4ffdfe5472c87e7a37c22ba164090921411d
  };
};
