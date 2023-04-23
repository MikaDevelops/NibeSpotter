const maria = require('mariadb');
const pool = maria.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    connectionLimit: 10
});

async function connect(){


    let connection;
    try {
        
        connection = await pool.getConnection();

    } catch (error) {

        console.error(error);

    } finally {
        if (connection) connection.release();
    }

}

module.exports={connect}