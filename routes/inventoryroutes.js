/**set up express routes */
const express = require("express")
const router = new express.Router()
const controller = require("../controllers/inventoryController")
const validate = require("../utilities/inventory-validation")

/**router and http verbs */
router.get(
  "/invvehicles",
  require("../utilities/index").handleerrors(controller.inventoryvehicles)
)
router.get(
  "/type/:id",
  require("../utilities/index").handleerrors(
    controller.getVehiclesByClassification
  )
)
router.get(
  "/detail/:inv_id",
  require("../utilities/index").handleerrors(controller.getVehicledetailsbyId)
)

router.get(
  "/management",
  require("../utilities/index").handleerrors(controller.management)
)

router.get(
  "/management/add-classification",
  require("../utilities/index").handleerrors(controller.addclassification)
)

router.get(
  "/management/add-inventory",
  require("../utilities/index").handleerrors(controller.addinventory)
)

/**post routes to add new classification to the database */
router.post(
  "/management/add-classification",
  validate.validateClassification(),
  validate.validateClassificationResult,
  require("../utilities/index").handleerrors(controller.insertnewclassification)
)

/**post routes to add new inventory to the database */
router.post(
  "/management/add-inventory",
  validate.validateInventory(),
  validate.validateInventoryResult,
  require("../utilities/index").handleerrors(controller.insertnewinventory)
)

module.exports = router
