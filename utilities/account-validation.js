/**this file handles the form data sanitation and validations.
 * requires the index.js file from the utilities folder
 * and the express-validator package to validate the data
 * and the express-validator package to sanitize the data
 */

const utilities = require(".")
const { body, validationResult } = require("express-validator")
const model = require("../models/accountmodel.js")
const validator = {}

/**this function is used to set the rules for validation form data */
validator.validationRules = () => {
  return [
    // firstname is required and must be string
    body("first_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("last_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      /**create a custom email validation logic to be used. */
      .custom(async (account_email) => {
        const existingEmail = await model.chceckExisitingEmail(account_email)
        if (existingEmail > 0) {
          throw new Error(
            "Email already exists. Please login or use a different email."
          )
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/**this function checks the data and returns errors or continues registration */
validator.validateRegistration = async function (req, res, next) {
  const submited = ({ first_name, last_name, account_email, account_password } =
    req.body)
  console.log("Registration Data:", req.body)
  let error = []

  error = validationResult(req)
  if (!error.isEmpty()) {
    let navigation = await utilities.getNavigations()
    /**building the forms from the utility section */
    let form = await utilities.registration()
    res.render("account/register", {
      error,
      title: "Register",
      navigation,
      first_name,
      last_name,
      account_email,
      form,
    })

    return
  }

  next()
}

/**forms validation for login. start with the email validation and then to password and set the rules needed
 * this function is used to set the rules for validation form data
 */
validator.loginValidationRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      /**create a custom email validation logic to be used. */
      .custom(async (email) => {
        const existingEmail = await model.chceckExisitingEmail(email)
        if (existingEmail === 0) {
          throw new Error(
            "Email does not exist. Please register or use a different email."
          )
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/**check the data being sent and valdiate before moving to login */
validator.validateLogin = async function (req, res, next) {
  const { email, account_password } = req.body
  console.log("Login Data:", req.body)

  let error = []
  error = validationResult(req)
  if (!error.isEmpty()) {
    let nav = await utilities.getNavigations()
    /**building the forms from the utility section */
    let form = await utilities.loginforms()
    res.render("account/login", {
      error,
      title: "Login",
      nav,
      email,
      form,
    })

    return
  }

  next()
}

module.exports = validator
