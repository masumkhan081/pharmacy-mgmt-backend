import Group from "../models/group.model.js";
//

async function getAllGroups(req, res) {
  let msg = "";
  Group.find()
    .sort({ $natural: -1 })
    .then((data) => {
      res.send({
        groups: data,
        msg,
      });
    })
    .catch((err) => {
      res.send(err);
    });
}

async function getGroups(req, res) {
  const { pagenumb } = req.query;
  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }
  let count = await Group.count();
  let msg = "";
  Group.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((data) => {
      res.send({
        groups: data,
        msg,
        count,
        skip,
        authstatus: false,
        limit: obj.limit,
      });
    })
    .catch((err) => {
      res.send(err);
    });
}

async function saveGroup(req, res) {
  const { name } = req.body;
  (await Group.findOne({ name }))
    ? res.status(400).send({ message: "Already exist" })
    : (await new Group({
        name,
      }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updateGroup(req, res) {
  const { id, name } = req.body;
  (await Group.findByIdAndUpdate(id, { name }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteGroup(req, res) {
  const { id } = req.params;
  (await Group.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default {
  getGroups,
  getAllGroups,
  saveGroup,
  deleteGroup,
  updateGroup,
};
