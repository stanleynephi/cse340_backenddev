/**require utilities to create the navigation and login form */
const utilities = require("../utilities/index")
const accountModel = require("../models/accountmodel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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

/**login process to log a user in. */
async function loginaccount(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    /**get user data from the forms */
    const { account_email, account_password } = req.body

    console.log(account_email, account_password)

    const exisiting_email = await accountModel.chceckExisitingEmailLogin(
      account_email
    )

    console.log(exisiting_email, "Email for login")
    console.log(
      exisiting_email.account_password,
      "This is the account password in the database"
    )

    if (!exisiting_email) {
      console.log("Sorry no email matches", exisiting_email)

      /**flash notification for errors */
      req.flash(
        "error",
        `Email does not exist in the database ${exisiting_email} please create an account.`
      )
      res.status(501).redirect("/account/login")
    }

    if (
      await bcrypt.compare(account_password, exisiting_email.account_password)
    ) {
      delete exisiting_email.account_password
      /**create a signed jwt token */
      const accessToken = jwt.sign(exisiting_email, process.env.ACCESS_TOKEN, {
        expiresIn: 3600 * 1000,
      })

      if (process.env.NODE_ENVIRONMENT === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again")
      return res.status(401).redirect("/account/login")
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("error", "Something went wrong. Please try again.")
    res.redirect("/account/login")
  }
}

/**async function to create the registration view */
async function registrationpage(req, res, next) {
  try {
    /**get the navigation and the registration forms*/
    const navigation = await utilities.getNavigations()
    const form = await utilities.registration()

    res.render("./account/register", {
      title: "Register An Account",
      navigation,
      error: null,
      form,
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

/**create the account management page where users get to after loging in */
async function accountmanagement(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    const accountData = res.locals.accountData

    console.log(accountData)
    res.render("./account/managementview", {
      title: "Account Management",
      navigation,
      accountData,
      notice: req.flash("notice"),
      error: null,
      message: "Uupdate account information",
    })
  } catch (error) {
    console.log("Error rendering management view", error)
    next(error)
  }
}

async function updateAccountView(req, res, next) {
  try {
    const navigation = await utilities.getNavigations()
    const accountId = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountByID(accountId)
    const accountInfo = res.locals.accountData
    console.log(`This is the accout Data`, accountData)

    const accountName = `${accountInfo.account_firstname} ${accountInfo.account_lastname}`

    res.render("./account/update", {
      title: "Update " + accountName + " Information",
      navigation,
      errors: null,
      message: "Update your account details below",
      account_id: accountInfo.account_id,
      account_firstname: accountInfo.account_firstname,
      account_lastname: accountInfo.account_lastname,
      account_email: accountInfo.account_email,
    })
  } catch (error) {
    console.error("Error rendering update account view:", error)
    next(error)
  }
}

//update account controller
async function updateAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_id } =
      req.body
    const result = await model.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (result) {
      // Get the updated data (currently returns an array)
      const updatedAccountData = await model.getAccountByID(account_id)
      console.log("Updated Data ", updatedAccountData)

      // ✅ Extract the first object from the array
      const updatedAccount = updatedAccountData[0]

      // Remove sensitive info
      delete updatedAccount.account_password

      /**create a new jwt token */
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN, {
        expiresIn: 3600 * 1000,
      })

      /**replace old cookie with new one */
      if (process.env.NODE_ENVIRONMENT === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      req.flash("notice", "Account updated successfully")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Update failed. Try again.")
      return res.redirect("/account/update/${account_id}")
    }
  } catch (error) {
    console.error("Error updating account:", error)
    next(error)
  }
}

/**logout and delete session */
function logout(req, res) {
  res.clearCookie("jwt")
  req.session?.destroy((err) => {
    if (err) console.error("Error destroying session:", err)
  })
  res.redirect("/account/login")
}

module.exports = {
  loginpage,
  registrationpage,
  registeraccount,
  loginaccount,
  accountmanagement,
  updateAccount,
  updateAccountView,
  logout,
}
