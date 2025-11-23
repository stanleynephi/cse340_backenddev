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

module.exports = {
  inventoryList,
  classificationList,
  getclassificationbyId,
  getvehicledatabyid,
}
