const path = require('path');
const pathToSqlite = path.resolve('db','nibespotter.db');
class Db{
 
    #typeOfDb;
    #dataBaseAddress;
    #spotDataModel;
    
    /**
     * Creates Db instance. Default database 'sqlite'.
     * @param {string} typeOfDb 'sqlite' or 'mariadb' 
     * @param {string} dataBaseAddress default is for sqlite (db/nibespotter.db)
     */
    constructor(typeOfDb='sqlite', dataBaseAddress = pathToSqlite){
        if (typeOfDb !== 'sqlite' && typeOfDb !== 'mariadb'){
            throw new Error('Db constructor: Not supported db-solution.');
        }
        this.#typeOfDb = typeOfDb;
        this.#dataBaseAddress = dataBaseAddress;
        const {spotDataModel} = require('./dataModel');
        this.#spotDataModel = spotDataModel;
    }

    /**
     * Runs start procedures for database. Checks database and creates tables if not yet created.
     */
    start(){

        switch(this.#typeOfDb) {

            case 'sqlite':
                const db = this.#openDatabase();
                this.#createTables(db);
                this.#closeDataBase(db);
                console.log('Using SQLite database.');
            break;

            case 'mariadb':
                // TODO
                console.log("Mariadb not suported yet.")
            break;
            
            default:
                throw new Error ('Database.start() type of database not supported.')

        }
    }

    /**
     * Checks exactly if table is in the database.
     * @param {string} tableName
     * @returns {Promise<boolean>} Promise that will resolve to true if table is found.
     */
    checkIfTableExists(tableName){

        if(this.#typeOfDb === 'sqlite'){

            return new Promise((resolve,reject)=>{
                const db = this.#openDatabase();
                let sqlString = `SELECT name FROM sqlite_master WHERE name = '${tableName}';`;
                
                db.get(sqlString,(err,row) => {
                    
                    if(err){
                        console.log(err);
                        reject(err);
                    }
                    
                    if (row) resolve(true);
                    if (!row) resolve(false);
                });
                this.#closeDataBase(db);
            })
        }
    }

    /**
     * Saves extracted spot price data to database.
     * @param {object[]} data in array. Structure [{startTime,endTime,price,priceArea}].
     */
    saveSpotData(data){
        if (data.length > 25) {
            throw new Error ('spot data too long');
        }else{
            const sqlString = this.#makeSqlInsertString(data);
            const db = this.#openDatabase();
            db.run(sqlString, function(err){
                if(err) console.log(err);
                console.log(
                    'Spotprice data inserted. Last row id: ' 
                    + this.lastID 
                    + ', rows inserted: '+this.changes
                    );
            });
            this.#closeDataBase(db);
        }
    }

    /**
     * Gets spot price data from database inbetween given startTime parameters. If no parameters are
     * passed or an empty array is passed, returns max 10000 lines from database.
     * @param {Array<string>} timestamps start time, end time. If empty array is passed gets all rows in table.
     * @returns {object[]} array of row objects.
     */
    getSpotData(timestamps=undefined) {

        if (Array.isArray(timestamps) && timestamps.length>2) throw new Error('getSpotData parameter array has more than 2 elements');
        if (!Array.isArray(timestamps) && timestamps != undefined) throw new Error ('getSpotData parameter not an array');

        return new Promise((resolve, reject)=>{
            let sqlString = `SELECT ${this.#spotDataModel.idField}, ${this.#spotDataModel.dataFields[0]},
            ${this.#spotDataModel.dataFields[1]}, ${this.#spotDataModel.dataFields[2]}
            FROM ${this.#spotDataModel.tableName}`;

            if(timestamps != undefined){
                if(timestamps[0] != undefined) {
                    sqlString += ` WHERE ${this.#spotDataModel.idField}`;
                    if(timestamps[1] != undefined){
                        sqlString += ' BETWEEN ? AND ?';
                    }else 
                    {
                        sqlString += ' = ?';
                    }
                }
            }else{
                timestamps = [];
            }

            sqlString += ` ORDER BY ${this.#spotDataModel.idField} ASC LIMIT 10000;`

            const db = this.#openDatabase();
            db.all(sqlString, timestamps, function(err, rows){
                if(err){
                    reject(err);
                }
                resolve(rows);
            });
            this.#closeDataBase(db);
        });
        
    }

    #openDatabase(){
        const sqlite = require('sqlite3').verbose();
        const dataBase = new sqlite.Database(this.#dataBaseAddress, (error) => {
            if(error) console.log(error.message +' '+ this.#dataBaseAddress);
        });
        return dataBase;
    }

    #closeDataBase(db){
        db.close();
    }

    #createTables(newDB){
   
        newDB.exec(`
        CREATE TABLE IF NOT EXISTS spotPrice
        (
            startTime BIGINT NOT NULL,
            endTime BIGINT NOT NULL,
            price FLOAT NOT NULL,
            priceArea VARCHAR(50) NOT NULL,
            PRIMARY KEY (startTime)
        );
       
        CREATE TABLE IF NOT EXISTS location
        (
            longtitude FLOAT NOT NULL,
            latitude FLOAT NOT NULL,
            name VARCHAR(80) NOT NULL,
            id INTEGER PRIMARY KEY
        );
    
        CREATE TABLE IF NOT EXISTS nibeSystem
        (
            id INTEGER PRIMARY KEY NOT NULL,
            productName VARCHAR(80) NOT NULL,
            serialNumber VARCHAR(80) NOT NULL,
            nibeStatusID INT NOT NULL,
            locationID INT NOT NULL,
            FOREIGN KEY (locationID) REFERENCES location(id)
        );
    
        CREATE TABLE IF NOT EXISTS nibeStatus
        (
            time DATETIME NOT NULL,
            roomTemperatureC FLOAT NOT NULL,
            outdoorTemperatureC FLOAT NOT NULL,
            id INTEGER PRIMARY KEY NOT NULL,
            hotWaterTemperatureC FLOAT NOT NULL,
            airFanSpeed INT NOT NULL,
            nibeSystemID INT NOT NULL,
            FOREIGN KEY (nibeSystemID) REFERENCES nibeSystem(id)
        );
    
        CREATE TABLE IF NOT EXISTS settingHistory
        (
            time DATETIME NOT NULL,
            id INTEGER PRIMARY KEY NOT NULL,
            roomTargetTempC FLOAT NOT NULL,
            ventilationBoost BOOLEAN NOT NULL,
            nibeSystemID INT NOT NULL,
            FOREIGN KEY (nibeSystemID) REFERENCES nibeSystem(id)
        );
    
        CREATE TABLE IF NOT EXISTS weatherInfo
        (
            time DATETIME NOT NULL,
            temperatureC FLOAT NOT NULL,
            id INTEGER PRIMARY KEY NOT NULL,
            serviceName VARCHAR(80) NOT NULL,
            locationID INT NOT NULL,
            FOREIGN KEY (locationID) REFERENCES location(id)
        );
        `);
    }

    /**
     * Makes insert string to be used in query.
     * @param {object[]} data array of spot price objects.
     * @returns {string} sql string
     */
    #makeSqlInsertString(data){

        let valuesString = '';

        for(let i=0; i < data.length; i++){
            let startTimeUnix = Math.floor(new Date(data[i].startTime).valueOf() / 1000);
            let endTimeUnix = Math.floor(new Date(data[i].endTime).valueOf() / 1000);
            valuesString += `('${startTimeUnix}','${endTimeUnix}','${data[i].price}','${data[i].priceArea}')`;
            if(i < data.length-1) valuesString += ',';
        }

        let insertString = `INSERT INTO ${this.#spotDataModel.tableName}(
            ${this.#spotDataModel.idField},${this.#spotDataModel.dataFields[0]},
            ${this.#spotDataModel.dataFields[1]}, ${this.#spotDataModel.dataFields[2]})
            VALUES `+valuesString +';';

        return insertString;
    }
}

module.exports={Db};