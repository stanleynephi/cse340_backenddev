/**require the database pool */
const pool = require("../database/index")

/**async select function to select * from the inventory table */
async function inventoryList() {
  try {
    const query = `select * from public.inventory`
    const data = await pool.query(query)
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

/**get the classification list from the database and set to order by the alphabetical order */
async function classificationList() {
  try {
    const query = `select * from public.classification order by classification_name`
    const data = await pool.query(query)
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

/**get the classification items based of the classification id provided */
async function getclassificationbyId(id) {
  try {
    const query = `select * from public.inventory as i join public.classification as c
     on i.classification_id = c.classification_id where i.classification_id = $1`
    const values = [id]
    const data = await pool.query(query, values)
    return data
  } catch (error) {
    console.log(error)
  }
}

async function getvehicledatabyid(id) {
  try {
    const query = `select * from public.inventory as i where i.inv_id = $1`
    const values = [id]
    const data = await pool.query(query, values)
    return data
  } catch (err) {
    console.log(err)
  }
}

async function checkclassification(classification_name) {
  try {
    const query = `select * from public.classification WHERE classification_name = $1`
    const value = [classification_name]
    const data = await pool.query(query, value)
    return data
  } catch (error) {
    console.log(error)
  }
}

async function addnewclassification(classification_name) {
  try {
    const query = `insert into public.classification(classification_name) values ($1)`
    const result = await pool.query(query, [classification_name])
    console.log("Classification added", result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**function to register the inventory item */
async function addnewinventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    //sql insert query
    const query = `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
    const result = await pool.query(query, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ])
    console.log("Vehicle Registered Successfully:", result)
    return result // Return the result of the query
  } catch (error) {
    console.error("Error vehicle could not be registered:", error)
    throw error // Re-throw the error to be handled by the calling function
  }
}

module.exports = {
  inventoryList,
  classificationList,
  getclassificationbyId,
  getvehicledatabyid,
  checkclassification,
  addnewclassification,
  addnewinventory,
}
