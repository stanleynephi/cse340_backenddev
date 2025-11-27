const pool = require("../database/index")

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

module.exports = {
  registerAccount,
  chceckExisitingEmail,
}
