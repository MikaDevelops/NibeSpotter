
const maria = require('mariadb');

async function connectToDatabase(){

    try {

        const connection = await maria.createConnection({

            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

        });
        
        return connection;

    } catch (error) {

        console.error("*********\nconnectToDataBase catch block\ngetting connection  failed\n*********\n"+error);
        
    } 
}



module.exports={connectToDatabase}