import MFR from "../models/mfr.model.ts";
//

async function getAllMFR(req, res) {
  MFR.find()
    .sort({ $natural: -1 })
    .then((manufacturers) => {
      console.log("getAllMFR:  ", manufacturers);
      res.send({
        manufacturers,
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load + "  err: " + err);
    });
}

async function getMFR(req, res) {
  const { pagenumb } = req.query;
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await MFR.count();
  MFR.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((manufacturers) => {
      res.send({
        manufacturers,
        count,
        skip,
        limit: obj.limit,
      });
    })
    .catch((err) => {
      res.send(obj.msg_err_load + "  err: " + err);
    });
}

async function saveMFR(req, res) {
  const { name } = req.body;
  (await MFR.findOne({ name }))
    ? res.status(400).send({ message: "Already exist" })
    : (await new MFR({
        name,
      }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updateMFR(req, res) {
  const { id, name } = req.body;
  (await MFR.findByIdAndUpdate(id, { name }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteMFR(req, res) {
  const { id } = req.params;
  (await MFR.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

const cmpFunctions = {
  getAllMFR,
  getMFR,
  saveMFR,
  deleteMFR,
  updateMFR,
};
export default cmpFunctions;
