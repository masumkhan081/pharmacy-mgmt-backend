
import   Salary   from "../models/salary.model.js";

async function getSalaries(req, res, searchObj) {
  const { pagenumb } = req.query;

  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await Salary.count();
  let msg = searchObj?.name ? `Searched for '${searchObj.name}'` : "plain--";

  Salary.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((salaries) => {
      res.status(200).send({
        salaries,
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

// have to stop one salary repeating for 2nd time
async function saveSalary(req, res) {
  const { staffId, month, year, dueAmount, paidAmount } = req.body;

  (await new Salary({
    staffId,
    month,
    year,
    dueAmount,
    paidAmount,
  }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updateSalary(req, res) {
  const { id, staffId, month, year, dueAmount, paidAmount } = req.body;
  (await Salary.findByIdAndUpdate(id, {
    staffId,
    month,
    year,
    dueAmount,
    paidAmount,
  }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deleteSalary(req, res) {
  const { id } = req.params;
  (await Salary.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default { getSalaries, saveSalary, updateSalary, deleteSalary };
