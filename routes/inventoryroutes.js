/**set up express routes */
const express = require("express")
const router = new express.Router()
const controller = require("../controllers/inventoryController")

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

module.exports = router
