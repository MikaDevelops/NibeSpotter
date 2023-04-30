
const maria = require('mariadb');
const pool = maria.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

async function connectToDatabase(){

    let connection;
    try {
        
        connection = await pool.getConnection();
        return connection;

    } catch (error) {
        console.error("*********\nconnectToDataBase catch block\ngetting connection from pool failed\n*********\n"+error);
    } 
}

async function closeConnection(connection){

    if(connection) { 
        
        await connection.release();

    }

}

module.exports={connectToDatabase, closeConnection}