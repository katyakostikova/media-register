const Pool = require('pg').Pool
const pool = new Pool(
    {
        user: "postgres",
        password: "7770",
        host: "localhost",
        port: 5432,
        database: "mass_media_register"
    }
)
module.exports = pool