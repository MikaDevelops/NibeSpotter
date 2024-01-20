class Db{
 
    #typeOfDb;
    #dataBaseAddress;
    #spotDataModel;
    
    /**
     * Creates Db instance. Default database 'sqlite'.
     * @param {string} typeOfDb 'sqlite' or 'mariadb' 
     * @param {string} dataBaseAddress default is for sqlite (db/nibespotter.db)
     */
    constructor(typeOfDb='sqlite', dataBaseAddress = '.db/nibespotter.db'){
        if (typeOfDb !== 'sqlite' && typeOfDb !== 'mariadb'){
            throw new Error('Db constructor: Not supported db-solution.');
        }
        this.#typeOfDb = typeOfDb;
        this.#dataBaseAddress = dataBaseAddress;
        const {spotDataModel} = require('./dataModel');
        this.#spotDataModel = spotDataModel;
    }

    start(){

        switch(this.#typeOfDb) {

            case 'sqlite':
                const db = this.#openDatabase();
                this.#createTables(db);
                this.#closeDataBase(db);
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

    saveSpotData(data){
        if (data.length > 100) {
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
     * @param {Array} timestamp start time, end time. If empty array is passed gets all rows in table.
     * @returns 
     */
    getSpotData(timestamp) {

        let sqlString = `SELECT 
        ${this.#spotDataModel.idField}, ${this.#spotDataModel.dataFields[0]},
        ${this.#spotDataModel.dataFields[1]}, ${this.#spotDataModel.dataFields[2]}
        FROM ${this.#spotDataModel.tableName}`;

        if(timestamp != undefined){
            if(timestamp[0] != undefined) {
                sqlString += ` WHERE ${this.#spotDataModel.idField}`;
                if(timestamp[1] != undefined){
                    sqlString += ' BETWEEN ? AND ?';
                }else {
                    sqlString += ' = ?';
                }
            }
        }else{
            timestamp = [];
        }

        sqlString += ` ORDER BY ${this.#spotDataModel.idField} ASC LIMIT 10000;`

        const db = this.#openDatabase();
        db.all(sqlString, timestamp, function(err, rows){
            if(err) console.log(err);
            console.log(rows); // TODO: remember to update the docs.
        })
        return null;
    }

    #openDatabase(){
        const sqlite = require('sqlite3').verbose();
        const dataBase = new sqlite.Database(this.#dataBaseAddress, (error) => {
            if(error) console.log(error.message);
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
            startTime DATETIME NOT NULL,
            endTime DATETIME NOT NULL,
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

    #makeSqlInsertString(data){

        let valuesString = '';

        for(let i=0; i < data.length; i+=3){
            valuesString += `('${data[i]}','${data[i+1]}','${data[i+2]}','FI')`;
            if(i < data.length-3) valuesString += ',';
        }

        let insertString = `INSERT INTO ${this.#spotDataModel.tableName}(
            ${this.#spotDataModel.idField},${this.#spotDataModel.dataFields[0]},
            ${this.#spotDataModel.dataFields[1]}, ${this.#spotDataModel.dataFields[2]})
            VALUES `+valuesString +';';
        
        console.log(insertString);
        return insertString;
    }
}

module.exports={Db};