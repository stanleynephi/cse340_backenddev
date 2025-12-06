const pool = require("../database/index")
const { get } = require("../routes/static")

/**add a new account to the database */
async function registerAccount(
  first_name,
  last_name,
  account_email,
  account_password
) {
  try {
    const query = `insert into public.account (account_firstname, account_lastname, account_email, account_password)
                   values ($1, $2, $3, $4) RETURNING *;`

    const result = await pool.query(query, [
      first_name,
      last_name,
      account_email,
      account_password,
    ])
    return result.rows[0]
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**checke the emails if it exists */
async function chceckExisitingEmail(account_email) {
  try {
    /**sql query to check if the email exists in the database */
    const query = `select * from public.account WHERE account_email = $1;`
    /**execute the query using the pool */
    const email = await pool.query(query, [account_email])
    /**return the result of the query */
    return email.rowCount
  } catch (error) {
    console.error("Error checking existing email:", error)
    throw error // Re-throw the error to be handled by the calling function
  }
}

/**check exisitin email for login process */
async function chceckExisitingEmailLogin(account_email) {
  try {
    /**sql query to check if the email exists in the database */
    const query = `select * from public.account WHERE account_email = $1;`
    /**execute the query using the pool */
    const email = await pool.query(query, [account_email])
    /**return the result of the query */
    console.log("email from database", email)
    return email.rows[0]
  } catch (error) {
    console.error("Error checking existing email:", error)
    throw error // Re-throw the error to be handled by the calling function
  }
}

/**get account based of the provided id */
async function getAccountByID(account_id) {
  try {
    const query = `SELECT * FROM public.account WHERE account_id = $1 `
    const result = await pool.query(query, [account_id])
    console.log(result.rows)
    return result.rows
  } catch (error) {
    console.log(`Error in retrieving the account data from the database`)
    return new Error(`Error in retrieving `)
  }
}

/**model to add update data to the databse */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  /**try catch insert query */
  try {
    const sql = `
      UPDATE public.account
      SET 
        account_firstname = $1,
        account_lastname = $2,
        account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    console.log(`Data Updated`, result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.log(error)
    throw new Error("Error updating Client Information")
  }
}

module.exports = {
  registerAccount,
  chceckExisitingEmail,
  chceckExisitingEmailLogin,
  getAccountByID,
  updateAccount,
}
