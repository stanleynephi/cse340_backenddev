const { Pool, Query } = require("pg")
require("dotenv")

let pool

/**check environment type and set ssl rejectUnathoirize to false */
if (process.env.NODEENVIRONMENT === "development") {
  pool = new Pool({
    connectionString: process.env.databaseConnection,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  if (!pool) {
    console.log("Connection termindated")
    return
  }

  /**test the connection ensure it is functioning */
  module.exports = {
    async query(text, params) {
      try {
        const response = await pool.query(text, params)
        console.log("Query was successfully executed", text)
        return response
      } catch (error) {
        throw error
      }
    },
  }
} else {
  /**establish a straigh connection if the node environment is not development and set ssl require to true*/
  pool = new Pool({
    connectionString: process.env.databaseConnection,
  })

  module.exports = pool
}
