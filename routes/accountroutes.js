const express = require("express")
const router = new express.Router()
const controller = require("../controllers/accountcontroller")
const registrationValidation = require("../utilities/account-validation")

/**routes to the accout page */
router.get(
  "/login",
  require("../utilities/index").handleerrors(controller.loginpage)
)

router.get(
  "/register",
  require("../utilities").handleerrors(controller.registrationpage)
)

router.post(
  "/register",
  registrationValidation.validationRules(),
  registrationValidation.validateRegistration,
  require("../utilities/index").handleerrors(controller.registeraccount)
)

module.exports = router
