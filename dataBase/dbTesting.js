require('dotenv').config({path: '../.env'});
const { setTimeout } = require('timers/promises');
const database = require('./Db.js');
const path = require('path');


let dataset = ['2000-01-02T16:00:00','2000-01-02T17:00:00','6.66',
'2000-01-02T17:00:00','2000-01-02T17:00:00','6.67',
'2000-01-02T18:00:00','2000-01-02T17:00:00','6.68'];



// test('database test', ()=> {
//saveSpotData(dataset);

let pathToDb = path.resolve('..', 'db', 'nibespotter.db');
const db = new database.Db('sqlite',pathToDb);

// start procedure
db.start();

db.checkIfTableExists('location').then(
    (value)=>{
        console.log(value);
    },
    (error)=>{console.log(error);}
).catch((error)=>{console.log(error)});

db.checkIfTableExists('locaftion').then(
    (value)=>{
        console.log(value);
    },
    (error)=>{console.log(error);}
).catch((error)=>{console.log(error)});

// save data to the database
db.saveSpotData(dataset);
// check that saved data is get from database
