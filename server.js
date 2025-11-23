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
