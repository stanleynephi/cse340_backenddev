/**create the navigations using async funtions */
const inventoryModel = require("../models/inventory_model")

/**use the data from the model to create the navigation links */
async function getNavigations(req, res, next) {
  let data = await inventoryModel.classificationList()
  let list = "<ul>"
  /**append other components to the lists */
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((rows) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      rows.classification_id +
      '" title="See our inventory of ' +
      rows.classification_name +
      ' vehicles">' +
      rows.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

async function vehiclesGrid(vehicles) {
  let grid

  if (vehicles.rows || vehicles.rows.lenght > 0) {
    grid = '<ul class="grid-display">'
    vehicles.rows.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '"title ="View' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    return "<p>No Vehicle Found</p>"
  }

  return grid
}

function handleerrors(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

/**function to render the car details */
async function buildcardetails(details) {
  let car = details.rows[0]
  let information

  if (car) {
    information = `<div class= "car-details">
      <div class="car-image-container">
        <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${
      car.inv_model
    }" />
      </div>
      <div class="car-info">
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
          car.inv_price
        )}</p>
        <p><strong>Description:</strong> ${car.inv_description}</p>
        <p><strong>Color:</strong> ${car.inv_color}</p>
        <p><strong>Year:</strong> ${car.inv_year}</p>
      </div>
    </div>
    `
  } else {
    return "<p>No car details found.</p>"
  }

  return information
}

module.exports = {
  getNavigations,
  vehiclesGrid,
  handleerrors,
  buildcardetails,
}
