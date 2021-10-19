const Vaccine = require('../schemas/Vaccine');

module.exports = function VaccineHandler() {
  const findVaccine = async (vaccineId) => {
    return Vaccine.findOne({ _id: vaccineId });
  };

  const findVaccines = async () => {
    return Vaccine.find();
  };

  const addVaccine = async (vaccineInfo) => {
    let newVaccine = new Vaccine(vaccineInfo);
    return newVaccine.save();
  };

  const updateVaccine = async (vaccineId, vaccineInfo) => {
    let modifiedVaccine = Vaccine.updateOne({ _id: vaccineId }, vaccineInfo);
    return modifiedVaccine;
  };

  const deleteVaccine = async (vaccineId) => {
    return Vaccine.deleteOne({ _id: vaccineId });
  };

  return {
    findVaccine,
    findVaccines,
    addVaccine,
    deleteVaccine,
    updateVaccine
  };
};
