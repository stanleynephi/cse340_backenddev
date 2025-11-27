/**validate the data coming from the classification form the user just filed to make sure
 * everything is correct and  data is sanitized before being sent to the database
 * and the express-validator package to validate the data
 */

const utilities = require(".")
const { body, validationResult } = require("express-validator")
const model = require("../models/inventory_model")
const validator = {}

/**validate rules for the addclassification input */
validator.validateClassification = () => {
  return [
    /**set the rules on what to expect in the input field */
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage(
        "Please provide a classification name with at least 3 characters."
      )
      .custom(async (classification_name) => {
        const existingclassification = await model.checkClassificationExists(
          classification_name
        )

        if (existingclassification) {
          throw new Error(
            "Classification already exists. Please use a different name."
          )
        }
      }),
  ]
}

/**functions to check to check the data and return errors if there is any */
validator.validateClassificationResult = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNavigations()
  let error = []
  error = validationResult(req)

  /**check if there is any error in the data */
  if (!error.isEmpty()) {
    res.render("./inventory/addclassification", {
      title: "Add Classification",
      nav,
      message: error.array()[0].msg, // Get the first error message
    })

    return
  }

  next()
}

/**function to validate the inventory items */
validator.validateInventory = () => {
  return [
    //set the validation rules for the add inventory forms
    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please Provide the Make of this Vehicle."),
    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please Provide the Model of this Vehicle."),
    body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4 })
      .withMessage("Please Provide the Year of this Vehicle."),
    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please Provide the Color of this Vehicle."),
    body("inv_price")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please Provide the Price of this Vehicle."),
    body("inv_miles")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please Provide the Miles of this Vehicle."),
    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Please Provide a Description of this Vehicle."),
    body("inv_image")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please Provide an Image of this Vehicle."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please Provide a Thumbnail of this Vehicle."),
  ]
}

/**validate the result */
validator.validateInventoryResult = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_color,
    inv_price,
    inv_description,
    inv_miles,
    inv_image,
    inv_thumbnail,
    classification_id,
  } = req.body
  let nav = await utilities.getNavigations()
  let classifications = await utilities.buildclassificationlist()
  let error = []
  error = validationResult(req)
  console.log("Validation errors:", error.array())

  //check for error
  if (!error.isEmpty()) {
    res.render("./inventory/addinventory", {
      title: "Add Inventory",
      nav,
      message: error.array()[0].msg, // Get the first error message
      classifications,
    })

    return
  }

  next()
}

module.exports = validator
