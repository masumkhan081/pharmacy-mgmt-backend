
import  Purchase   from "../models/purchase.model.js";

async function getPurchases(req, res, searchObj) {
  const { pagenumb } = req.query;

  let skip = 0;
  if (pagenumb) {
    skip = obj.limit * pagenumb - obj.limit;
  }

  let count = await Purchase.count();
  let msg = searchObj?.name ? `Searched for '${searchObj?.name}'` : "plain--";

  Purchase.find()
    .sort({ $natural: -1 })
    .limit(obj.limit)
    .skip(skip)
    .then((purchases) => {
      res.status(200).send({
        purchases,
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

//  some sort of check neccessary
async function savePurchase(req, res) {
  const { purchaseAt, drugs, bill } = req.body;

  (await new Purchase({
    purchaseAt,
    drugs,
    bill,
  }).save())
    ? res.status(200).send({ message: "Saved successfully" })
    : res.status(400).send({ message: "Error saving new unit" });
}

async function updatePurchase(req, res) {
  const { id, purchaseAt, drugs, bill } = req.body;
  (await Purchase.findByIdAndUpdate(id, {
    purchaseAt,
    drugs,
    bill,
  }))
    ? res.status(200).send({ message: "Updated successfully" })
    : res.status(400).send({ message: "Error in update" });
}

async function deletePurchase(req, res) {
  const { id } = req.params;
  (await Purchase.findByIdAndDelete(id))
    ? res.status(200).send({ message: "Deleted successfully" })
    : res.status(400).send({ message: "Error in deletion" });
}

export default { getPurchases, savePurchase, deletePurchase, updatePurchase };
