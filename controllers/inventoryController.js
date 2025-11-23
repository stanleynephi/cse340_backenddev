/**require the inventory models to get the data from the database and then return that to the view*/
const inventoryModel = require("../models/inventory_model")
const utilities = require("../utilities/index")

/**async function to get data from the model*/
async function inventoryvehicles(req, res, next) {
  try {
    const inventoryItems = await inventoryModel.inventoryList()
    console.log(inventoryItems)
    return inventoryItems
  } catch (error) {
    console.log(error)
  }
}

/**async function to get vehicles data based on the classification */
async function getVehiclesByClassification(req, res, next) {
  try {
    /**get the classification if from the route, the navigations*/
    const navigation = await utilities.getNavigations()
    const id = req.params.id
    const vehicles = await inventoryModel.getclassificationbyId(id)
    console.log(vehicles.rows)

    if (vehicles.rows || vehicles.rows.lenght > 0) {
      const grid = await utilities.vehiclesGrid(vehicles)
      const classification_name = vehicles.rows[0].classification_name
      console.log(classification_name)
      let classification_title
      /**condition to check for the page title before rendering */
      if (classification_name) {
        classification_title = classification_name + " " + "Vehicles"
      } else {
        classification_title = "Vehicles"
      }
      res.render("./inventory/classification", {
        title: classification_title,
        navigation,
        grid,
      })
    } else {
      res.render("./inventory/classification", {
        title: "No vehicle Classification",
        navigation,
        grid: "<p>No Vehicle available</p>",
      })
    }
  } catch (error) {
    console.log(error)
  }
}

/**async function to get vehicle details by id */
async function getVehicledetailsbyId(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    const id = req.params.inv_id
    const vehiclesdata = await inventoryModel.getvehicledatabyid(id)
    console.log(vehiclesdata)

    if (vehiclesdata.rows || vehiclesdata.rows.lenght > 0) {
      const details = await utilities.buildcardetails(vehiclesdata)
      const classification_name =
        vehiclesdata.rows[0].inv_make + " " + vehiclesdata.rows[0].inv_model
      console.log(classification_name)
      let classification_title

      if (classification_name) {
        classification_title = classification_name
      } else {
        classification_title = "Vehicle Information"
      }

      res.render("./inventory/details", {
        title: classification_title,
        navigation,
        details,
      })
    } else {
      res.render("./inventory/details", {
        title: "No Vehicle Data Available",
        navigation,
        detail: "<p>No Vehicle Available</p>",
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  inventoryvehicles,
  getVehiclesByClassification,
  getVehicledetailsbyId,
}
