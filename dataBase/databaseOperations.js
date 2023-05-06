const {connectToDatabase} = require('./mariaDB.js');
const {spotDataModel} = require('./dataModel.js');

/**
 * Inserts data to database.
 * @param {string[]} data - array of price data
 */
function saveSpotData(data){

   connectToDatabase()
   .then((conn)=>{

        // Modify pricedata for batch insert
        const priceData = batchData(data);

        // SQL string for batch insert
        let sqlString = 
        `INSERT INTO ${spotDataModel.tableName} (${spotDataModel.idField},
        ${spotDataModel.dataFields[0]}, ${spotDataModel.dataFields[1]} , ${spotDataModel.dataFields[2]}
        ) VALUES (?, ?, ?, "FI")`; // TODO: pricearea from spot-data


        conn.batch(sqlString, priceData)
            .then((res)=> {
                conn.end();
                console.log(res);
            })
            .catch(error=> {
                conn.end();
                console.error(error);   
            });

    }).catch((error)=>{console.error(error)});

}

/**
 * Makes array of price data sequence into bachable array.
 * @param {string[]} data - array of price data to be modified
 * @returns array with arrays of hourly price data
 */
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