const utilities = require("../utilities/index")

/**create the function to build home */
async function buildHome(req, res) {
  const navigation = await utilities.getNavigations()
  res.render("index", { title: "Home", navigation })
}

module.exports = { buildHome }
