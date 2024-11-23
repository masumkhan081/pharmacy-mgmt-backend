
import  Unit  from "../models/unit.model.js";
//

async function getUnits(req, res) {
  const { pagenumb } = req.query;

  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await Unit.count();
  Unit
    .find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((units) => {
      res.status(200).send({
        units,
        count,
        skip,
        limit: obj.limit,
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load + "  err: " + err);
    });
}

async function saveUnit(req, res) {
  const { name } = req.body;
  (await Unit.findOne({ name }))
    ? res.status(400).send({ message: "Already exist" })
    : (await new Unit({
        name,
      }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updateUnit(req, res) {
  const { id, name } = req.body;
  (await Unit.findByIdAndUpdate(id, { name }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteUnit(req, res) {
  const { id } = req.params;
  (await Unit.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default {
  getUnits,
  saveUnit,
  deleteUnit,
  updateUnit,
};
