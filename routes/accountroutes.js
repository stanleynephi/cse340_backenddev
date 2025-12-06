const express = require("express")
const router = new express.Router()
const controller = require("../controllers/accountcontroller")
const registrationValidation = require("../utilities/account-validation")
const { route } = require("./static")

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

/**login post router */
router.post(
  "/login",
  require("../utilities/index").handleerrors(controller.loginaccount)
)

/**management account */
router.get(
  "/",
  require("../utilities/logins").checkloggedin,
  require("../utilities/index").handleerrors(controller.accountmanagement)
)

//update account route
router.get(
  "/update/:account_id",
  require("../utilities/logins").checkloggedin,
  require("../utilities/index").handleerrors(controller.updateAccountView)
)

//post for the update
router.post(
  "/update",
  require("../utilities/logins").checkloggedin,
  require("../utilities/index").handleerrors(controller.updateAccount)
)

//logout route
router.get(
  "/logout",
  require("../utilities/logins").checkloggedin,
  require("../utilities/index").handleerrors(controller.logout)
)

module.exports = router
