const Rule = require('../schemas/Rule');

module.exports = function SpaceHandler() {
  const findRule = async (ruleId) => {
    return Rule.findOne({ _id: ruleId });
  };

  const findRules = async () => {
    return Rule.find();
  };

  const addRules = async (rules) => {
    let promises = [];
    for (const rule of rules) {
      let newRule = new Rule(rule);
      promises.push(newRule.save());
    }
    return promises;
  };

  const deleteRules = async (ruleIds) => {
    let promises = [];
    for (const ruleId of ruleIds) {
      promises.push(Rule.deleteOne({ _id: ruleId }));
    }
    return promises;
  };

  const updateRules = async (rules) => {
    let promises = [];
    for (const rule of rules) {
      promises.push(Rule.updateOne({ _id: rule._id }, rule))
    }
    return promises;
  };

  return {
    findRule,
    findRules,
    addRules,
    deleteRules,
    updateRules
  };
};
