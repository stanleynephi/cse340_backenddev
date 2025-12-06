const { json } = require("body-parser")
const jwtToken = require("jsonwebtoken")
require("dotenv").config()

/**check jwt token */
function checkJWT(req, res, next) {
  if (req.cookies.jwt) {
    jwtToken.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }

        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/**function to check if the user is logged in to their account */
function checkloggedin(req, res, next) {
  /**condition to check if a user is logged in */
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please Log in")
    return res.redirect("/account/login")
  }
}

/**check the users account type */
function checkemployeeoradmin(req, res, next) {
  // 🧠 Allow visiting login/logout pages without redirecting
  const publicPaths = ["/account/login", "/account/logout"]
  if (publicPaths.includes(req.path)) {
    return next()
  }

  // 🛑 If no JWT, redirect to login
  if (!res.locals.loggedin) {
    console.log("❌ No JWT found, redirecting to login.")
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  // ✅ Allow only Employee or Admin
  const role = res.locals.accountData?.account_type
  if (role === "Employee" || role === "Admin") {
    return next()
  }

  req.flash("error", "Unauthorized access.")
  res.redirect("/")
}

module.exports = {
  checkJWT,
  checkloggedin,
  checkemployeeoradmin,
}
