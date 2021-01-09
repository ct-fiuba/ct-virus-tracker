module.exports = function infectedController(visitHandler) {

  const errorDB = (res, err) => {
    console.log(err.message);
    return res.status(500).json({ reason: 'DB Error' });
  };


  const add = async (req, res, next) => {
    visits = req.body.visits;
    try {
      let count = await visitHandler.detectVisits(visits);
      if (count.n !== visits.length) {
        return res.status(404).json({ reason: `${visits.length - count.n} visits not found` });
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
