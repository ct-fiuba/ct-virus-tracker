module.exports = function vaccinesController(vaccineHandler) {

  const errorDB = (res, err) => {
    console.log(err.message);
    return res.status(500).json({ reason: 'DB Error' });
  };

  const get = async (req, res, next) => {
    return vaccineHandler.findVaccines()
      .then(vaccines => {
        return res.status(200).json(vaccines);
      })
      .catch(err => errorDB(res, err));
  };

  const getById = async (req, res, next) => {
    return vaccineHandler.findVaccine(req.params.vaccineId)
      .then(vaccine => {
        if (!vaccine) return res.status(404).json({ reason: 'Vaccine does not exist' });
        return res.status(200).json(vaccine);
      })
      .catch(err => errorDB(res, err));
  };

  const add = async (req, res, next) => {
    return vaccineHandler.addVaccine(req.body)
      .then(vaccine => {
        return res.status(201).json(vaccine)
      })
      .catch(err => errorDB(res, err));
  };

  const remove = async (req, res, next) => {
    return vaccineHandler.deleteVaccine(req.params.vaccineId)
      .then(vaccine => {
        return res.status(204).json(vaccine);
      })
      .catch(err => errorDB(res, err));
  };

  const update = async (req, res, next) => {
    return vaccineHandler.updateVaccine(req.params.vaccineId, req.body)
    .then(vaccine => {
      return res.status(200).json(vaccine);
    })
    .catch(err => errorDB(res, err));
  };

  return {
    get,
    getById,
    add,
    update,
    remove
  };
};
