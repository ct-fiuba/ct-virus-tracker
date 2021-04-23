module.exports = function infectedController(visitHandler) {

  const errorDB = (res, err) => {
    console.log(err.message);
    return res.status(500).json({ reason: 'DB Error' });
  };


  const add = async (req, res, next) => {
    code = req.body.userGeneratedCode;
    try {
      let count = await visitHandler.detectVisit(code);
      if (count.n !== 1) {
        return res.status(404).json({ reason: "Visit not found" });
      }
      return res.status(201).send()
    } catch(err) {
      errorDB(res, err);
    }
  };

  return {
    add,
  };
};
