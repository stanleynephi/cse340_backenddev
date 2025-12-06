/**require the inventory models to get the data from the database and then return that to the view*/
const { native } = require("pg")
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
    const navigation = await utilities.getNavigations()
    const id = req.params.id

    const vehicles = await inventoryModel.getclassificationbyId(id)
    console.log("Query result rows:", vehicles.rows)

    // Check if any vehicles exist
    if (vehicles.rows.length > 0) {
      const grid = await utilities.vehiclesGrid(vehicles)

      const classification_name =
        vehicles.rows[0].classification_name || "Vehicles"

      const classification_title = classification_name + " Vehicles"

      return res.render("./inventory/classification", {
        title: classification_title,
        navigation,
        grid,
      })
    } else {
      return res.render("./inventory/classification", {
        title: "No Vehicle Classification",
        navigation,
        grid: "<p>No vehicles available in this classification.</p>",
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
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

/**async function to render the management view */
async function management(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()

    res.render("./inventory/management", {
      title: "Managment Center",
      navigation,
      error: null,
    })
  } catch (error) {
    console.log(error)
    if (error) {
      req.flash("error", error)
      res.render("./inventory/management", {
        title: "Mangement Center",
        navigation,
        error: null,
      })
    }
  }
}

/**async function to render the delete view */
async function deletevehicle(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    const id = req.params.inv_id
    const vehicledetails = await inventoryModel.getvehicledatabyid(id)
    console.log("Here is the vehicle details", vehicledetails)
    const details = await utilities.buildcardeletionconfirmation(vehicledetails)
    console.log("Rendered details", details)

    res.render("./inventory/delete", {
      title: "Delete Vehicle",
      navigation,
      error: null,
      details,
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**async fuction to remove completely */
async function removevehicles(req, res, next) {
  try {
    const id = req.params.inv_id
    console.log("This is the id of the vehicle to be deleted", id)
    const deletevehicles = await inventoryModel.deletevehicle(id)

    if (deletevehicles) {
      req.flash("success", "Vehicle successfully deleted.")
      res.redirect("/") // redirect to home page
    } else {
      req.flash("error", "Vehicle not found. Nothing was deleted.")
      res.redirect("/")
    }
  } catch (error) {
    req.flash("error", "Something went wrong while deleting the vehicle.")
    res.redirect("/")
    next(error)
  }
}

/**async function to render the add classification page */
async function addclassification(req, res, next) {
  try {
    /**get the navigations */
    const navigation = await utilities.getNavigations()

    res.render("./inventory/addclassification", {
      title: "Add New Classification",
      navigation,
      error: null,
      message: "Add a classification ",
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

/** post logic to add new classification */
async function insertnewclassification(req, res, next) {
  try {
    console.log("Adding Process has started")
    /**get the navigation and the classification name from the forms */
    const navigation = await utilities.getNavigations()
    const { classification_name } = req.body

    /**pass the classification name to the database */
    const result = await inventoryModel.addnewclassification(
      classification_name
    )

    /**if the result is successful, render the inventory management page */
    if (result.rows.length > 0) {
      console.log("Good")
      req.flash("notice", "Vehicle classification was added successfully.")
      res.status(201).render("./inventory/management", {
        title: "Managment Center",
        navigation,
        error: null,
      })
    } else {
      req.flash("error", "Error adding classification to the database")
      res.status(501).redirect("/inv/management/add-classification")
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**async function to render the add inventory page */
async function addinventory(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    const classifications = await utilities.buildclassificationlist()

    res.render("./inventory/addinventory", {
      title: "Add Inventory",
      navigation,
      error: null,
      message: "Add a new vehicles ",
      classifications,
    })
  } catch (error) {
    console.log(error)
  }
}

/**async to insert new inventory into the database */
async function insertnewinventory(req, res, next) {
  /**get the navigation and the data to send to the inventory model */
  try {
    const navigation = await utilities.getNavigations()
    const classifications = await utilities.buildclassificationlist()

    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    console.log("This is the inventory data collected", req.body)

    const data = await inventoryModel.addnewinventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )
    console.log("Inventory Item Added Successfully", data)

    if (data) {
      req.flash("notice", "Inventory Added Successfully")
      res.status(200).redirect("/inv/management")
    } else {
      const { inv_classification } = req.body
      req.flash("notice", "Inventory Data Was Not Added")
      res.status(501).redirect("/inv/management/add-inventory", {
        title: "Add Inventory",
        navigation,
        message: req.flash("notice"),
        classifications, // rebuild dropdown
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        inv_classification,
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  inventoryvehicles,
  getVehiclesByClassification,
  getVehicledetailsbyId,
  management,
  addclassification,
  addinventory,
  insertnewclassification,
  insertnewinventory,
  deletevehicle,
  removevehicles,
}
