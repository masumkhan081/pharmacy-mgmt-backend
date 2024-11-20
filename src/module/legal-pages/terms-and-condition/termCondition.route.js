const { Router } = require("express");
const router = Router();
const termConditionController = require("./termCondition.controller");
//
router.post("/", termConditionController.createTermCondition);
router.get("/", termConditionController.getTermCondition);
router.patch("/:id", termConditionController.updateTermCondition);
router.delete("/:id", termConditionController.deleteTermCondition);

module.exports = router;
