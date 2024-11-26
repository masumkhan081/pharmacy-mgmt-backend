
import  Staff from "../models/staff.model.js";

async function getStaff(req, res, searchObj) {
  const { pagenumb } = req.query;

  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await Staff.count();
  let msg = searchObj?.name ? `Searched for '${searchObj.name}'` : "plain--";

  Staff.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .populate('user','role')
    .then((staff) => {
      res.status(200).send({
        staff,
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

async function saveStaff(req, res) {
  const { fullName, email, phone, designation, isUser, userId } = req.body;

  (await Staff.findOne({ email }))
    ? res.status(400).send({ message: "Already exist" })
    : (await new Staff({
        fullName,
        email,
        phone,
        designation,
        isUser,
        userId,
      }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

// have to stop one email for second time
async function updateStaff(req, res) {
  const { id, fullName, email, phone, designation, isUser, userId } = req.body;

  // (await Staff.find({ email:email, id: { $ne: id } }))
  //   ? res.status(400).send({ message: "Already a user with this email" })
  //   :

  (await Staff.findByIdAndUpdate(id, {
    fullName,
    email,
    phone,
    designation,
    isUser,
    userId,
  }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteStaff(req, res) {
  const { id } = req.params;
  (await Staff.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default { getStaff, saveStaff, updateStaff, deleteStaff };
