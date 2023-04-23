const {connectToDatabase, closeConnection} = require('./mariaDB.js');
const {spotDataModel} = require('./dataModel.js');

async function saveSpotData(data){
    let connection;
    try{

        connection = await connectToDatabase();

        const priceData = batchData(data);

        let sqlString = 
            `INSERT INTO ${spotDataModel.tableName} (${spotDataModel.idField},
            ${spotDataModel.dataFields[0]}, ${spotDataModel.dataFields[1]} , ${spotDataModel.dataFields[2]}
            ) VALUES (?, ?, ?, "FI")`;
        response = connection.batch(sqlString, priceData);

    }catch(error){
        console.log(error);
    } finally { await closeConnection(connection); }
    
}

function batchData(data){
    if (data.length%3 == 0){

        let resultArray = [];

        for(let i=0; i < data.length; i+=3){
            let row = [data[i], data[i+1], data[i+2]];
            resultArray.push(row);
        }

        return resultArray;
    }
    else {
        throw new Error('data not complete');
    }
    
}

module.exports={saveSpotData}