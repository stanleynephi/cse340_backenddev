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

  if (vehicles.rows) {
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

    <button type="button" onclick="window.location.href='/inv/delete/${
      car.inv_id
    }'">Delete Car</button>
    `
  } else {
    return "<p>No car details found.</p>"
  }

  return information
}

/**function to redner the car details before deletion */
async function buildcardeletionconfirmation(details) {
  let car = details.rows[0]
  let information

  if (car) {
    information = `
    <div class="car-details">
      <div class="car-image-container">
        <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${car.inv_model}" />
      </div>

      <div class="car-info">
        <p><strong>Model:</strong> ${car.inv_make} ${car.inv_model}</p>
      </div>
    </div>

    <button type="button" onclick="deleteCar(${car.inv_id})">Delete Car</button>

    <script>
      function deleteCar(id) {
        fetch('/inv/delete/' + id, { method: 'DELETE' })
          .then(() => window.location.href = '/')
          .catch(err => console.error(err));
      }
    </script>
  `
  }
  return information
}

/**function to build login forms */
async function login() {
  let forms = `
  <form action="/account/login" method="POST" class="login_forms">
    <label for="email">
      Email:
      <input type="email" id="email" name="account_email" required>
    </label>
    
    <label for="password">
      Password:
      <input type="password" id="password" name="account_password" required>
    </label>
    
    <div>
      <button type="submit">Login</button>
      <button type="button" onclick="window.location.href='/account/register'">Register</button>
    </div>
  </form>
  `

  return forms
}

async function registration() {
  let forms = `
  <form action="/account/register" method="POST" class="registration_forms">
    <label for="firstname">
    First Name
    <input type="text" name="first_name" id="firstname" required/>
    </label>

    <label for="lastname">
    Last Name
    <input type="text" name="last_name" id="lastname" required />
    </label>
    

    <label for="email">
    Email Address
    <input type="email" name="account_email" id="email"  required />
    </label>
    

    <label for="password">
    Password
    <span>Passwords must be at least 8 characters and contain at least 1 number, 1 capital letter and 1 special character</span> 
    <input type="password" name="account_password" id="password" required minlength="8"/>
    </label>
    

    <div>
        <button type="submit">Create Account</button>
        <button type="button" onclick="window.location.href='/account/login'">Login</button>
    </div>
  </form>
`

  return forms
}

async function buildclassificationlist(classification_id = null) {
  let data = await inventoryModel.classificationList()
  let classificationList =
    '<select name="classification_id" id="classificationList" class="classificationList"  required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = {
  getNavigations,
  vehiclesGrid,
  handleerrors,
  buildcardetails,
  login,
  registration,
  buildclassificationlist,
  buildcardeletionconfirmation,
}
