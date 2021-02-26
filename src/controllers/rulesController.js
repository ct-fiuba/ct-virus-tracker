module.exports = function rulesController(ruleHandler) {

  const errorDB = (res, err) => {
    console.log(err.message);
    return res.status(500).json({ reason: 'DB Error' });
  };

  const get = async (req, res, next) => {
    return ruleHandler.findRules()
      .then(rules => {
        console.log(rules);
        return res.status(200).json(rules);
      })
      .catch(err => errorDB(res, err));
  };

  const getSingleRule = async (req, res, next) => {
    return ruleHandler.findRule(req.params.ruleId)
      .then(rule => {
        if (!rule) return res.status(404).json({ reason: 'Rule not found' });
        return res.status(200).json(rule);
      })
      .catch(err => errorDB(res, err));
  };

  const add = async (req, res, next) => {
    return ruleHandler.addRules(req.body.rules)
      .then(rules => {
        console.log(rules);
        return res.status(201).json(rules)
      })
      .catch(err => errorDB(res, err));
  };

  const remove = async (req, res, next) => {
    return ruleHandler.deleteRules(req.body.ruleIds)
      .then(info => {
        console.log(info);
        return res.status(204).json(info);
      })
      .catch(err => errorDB(res, err));
  };

  const update = async (req, res, next) => {
    return ruleHandler.updateRules(req.body.rules)
    .then(info => {
      console.log(info);
      return res.status(200).json(info);
    })
    .catch(err => errorDB(res, err));
  };

  return {
    get,
    getSingleRule,
    add,
    update,
    remove
  };
};
