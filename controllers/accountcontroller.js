/**require utilities to create the navigation and login form */
const utilities = require("../utilities/index")
const accountModel = require("../models/accountmodel")
const bcrypt = require("bcryptjs")

/**async function to create the login view */
async function loginpage(req, res, next) {
  try {
    /**navigation and forms */
    const navigation = await utilities.getNavigations()
    const forms = await utilities.login()

    res.render("./account/login", {
      title: "Login",
      navigation,
      error: null,
      forms,
    })
  } catch (error) {
    console.log(error)
    if (error) {
      req.flash("error", error)
      res.render("./account/login", {
        title: "Login",
        navigation,
        forms,
      })
    }
  }
}

/**async function to create the registration view */
async function registrationpage(req, res, next) {
  try {
    /**get the navigation and the registration forms*/
    const navigation = await utilities.getNavigations()
    const forms = await utilities.registration()

    res.render("./account/register", {
      title: "Register An Account",
      navigation,
      error: null,
      forms,
    })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
}

/**async function to register account */
async function registeraccount(req, res, next) {
  try {
    /**get the navigationa and the account information from the forms */
    const navigation = await utilities.getNavigations()
    const { first_name, last_name, account_email, account_password } = req.body
    console.log(first_name, last_name, account_email, account_password)

    let hashedpassword

    try {
      /**hash the passwords for the user */
      hashedpassword = await bcrypt.hashSync(account_password, 10)
      console.log("Hashed Password", hashedpassword)
    } catch (error) {
      console.log("Error hashing password:", error)
      req.flash(
        "error",
        "An error occured while processing your request. Please try again"
      )
      res.status(501).redirect("/account/register")
    }

    /**model to register to account using the inventory model */
    const registration = await accountModel.registerAccount(
      first_name,
      last_name,
      account_email,
      hashedpassword
    )

    if (registration) {
      req.flash("notice", "Account created sucessfully, Please Login")
      res.status(201).redirect("/account/login")
    } else {
      req.flash(
        "error",
        "Error creating account Please check your details and try again"
      )
      res.status(501).redirect("/account/register")
    }
  } catch (error) {
    console.log(error)
    req.flash("error", "An error occured while creating your account")
    res.redirect("/account/register")
  }
}

module.exports = {
  loginpage,
  registrationpage,
  registeraccount,
}
