import Formulation  from "../models/formulation.model.js";
//

async function getFormulations(req, res, searchObj = { name: "" }) {
  const { pagenumb } = req.query;

  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await Formulation.count();
  let msg = searchObj.name ? `Searched for '${searchObj.name}'` : "plain--";

  Formulation.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((formulations) => {
      res.status(200).send({
        formulations,
        msg,
        count,
        skip,
        limit: obj.limit,
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load + "  err: " + err);
    });
}

async function saveFormulation(req, res) {
  const { fullName, shortName } = req.body;
  (await Formulation.findOne({ shortName }))
    ? res.status(400).send({ message: "Already exist" })
    : (await new Formulation({
        fullName,
        shortName,
      }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updateFormulation(req, res) {
  const { id, fullName, shortName } = req.body;
  (await Formulation.findByIdAndUpdate(id, { fullName, shortName }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteFormulation(req, res) {
  const { id } = req.params;
  (await Formulation.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default {
  getFormulations,
  saveFormulation,
  updateFormulation,
  deleteFormulation,
};
