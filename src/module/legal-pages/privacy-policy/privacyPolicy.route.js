const { Router } = require("express");
const router = Router();
const privacyPolicyController = require("./privacyPolicy.controller");
//
router.post("/", privacyPolicyController.createPrivacyPolicy);
router.get("/", privacyPolicyController.getPrivacyPolicies);
router.patch("/:id", privacyPolicyController.updatePrivacyPolicy);
router.delete("/:id", privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
