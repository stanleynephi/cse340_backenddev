/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const pool = require("./database/index")
const app = express()
const expressLayout = require("express-ejs-layouts")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventory = require("./routes/inventoryroutes")
const account = require("./routes/accountroutes")
const session = require("express-session")
const bodyparser = require("body-parser")

/**express session setup */
app.use(
  session({
    /**sest up the connect-pg-simple to store the session data */
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    /**key to create a session secret */
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true,
    name: "session_ID",
  })
)

/**middleware flash message setup */
app.use(require("connect-flash")())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/**body parser set up send and receive json data */
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

/**ejs view engine set up */
app.set("view engine", "ejs")
app.use(expressLayout)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
//index route
app.get(
  "/",
  require("./utilities/index").handleerrors(baseController.buildHome)
)

app.use("/inv", require("./utilities/index").handleerrors(inventory))

app.use("/account", require("./utilities/index").handleerrors(account))

/**basic error handling for a 404 page not found*/
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry page not found",
  })
})

/**render the page */
app.use(async (err, req, res, next) => {
  let navigation = await require("./utilities/index").getNavigations()
  console.error(`Error at : "${req.originalUrl}" : ${err.message}`)
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route"
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    navigation,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  /**trigger the pool */
  console.log(`app listening on ${host}:${port}`)
})
