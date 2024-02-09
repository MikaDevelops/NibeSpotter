require('dotenv').config({path: '../.env'});
const { isTodaysDataSaved } = require('../spotPrice/IsTodaysDataSaved.js');
const database = require('./Db.js');
const path = require('path');


let dataset = ['2000-01-02T16:00:00','2000-01-02T17:00:00','6.66',
'2000-01-02T17:00:00','2000-01-02T17:00:00','6.67',
'2000-01-02T18:00:00','2000-01-02T17:00:00','6.68'];

let tooLongDataSet = [
    '2000-01-02T10:00:00','2000-01-02T11:00:00','5.55','FI',
'2000-01-02T10:00:01','2000-01-02T11:00:01','6.55','FI',
'2000-01-02T10:00:02','2000-01-02T11:00:02','7.55','FI',
'2000-01-02T10:00:03','2000-01-02T11:00:03','8.55','FI',
'2000-01-02T10:00:04','2000-01-02T11:00:04','9.55','FI',
'2000-01-02T10:00:05','2000-01-02T11:00:05','10.55','FI',
'2000-01-02T10:00:06','2000-01-02T11:00:06','11.55','FI',
'2000-01-02T10:00:07','2000-01-02T11:00:07','12.55','FI',
'2000-01-02T10:00:08','2000-01-02T11:00:08','13.55','FI',
'2000-01-02T10:00:09','2000-01-02T11:00:09','14.55','FI',
'2000-01-02T10:00:10','2000-01-02T11:00:10','15.55','FI',
'2000-01-02T10:00:11','2000-01-02T11:00:11','16.55','FI',
'2000-01-02T10:00:12','2000-01-02T11:00:12','17.55','FI',
'2000-01-02T10:00:13','2000-01-02T11:00:13','18.55','FI',
'2000-01-02T10:00:14','2000-01-02T11:00:14','19.55','FI',
'2000-01-02T10:00:15','2000-01-02T11:00:15','20.55','FI',
'2000-01-02T10:00:16','2000-01-02T11:00:16','21.55','FI',
'2000-01-02T10:00:17','2000-01-02T11:00:17','22.55','FI',
'2000-01-02T10:00:18','2000-01-02T11:00:18','23.55','FI',
'2000-01-02T10:00:19','2000-01-02T11:00:19','0.55','FI',
'2000-01-02T10:00:20','2000-01-02T11:00:20','1.55','FI',
'2000-01-02T10:00:21','2000-01-02T11:00:21','2.55','FI',
'2000-01-02T10:00:22','2000-01-02T11:00:22','3.55','FI',
'2000-01-02T10:00:23','2000-01-02T11:00:23','4.55','FI',
'2000-01-02T10:00:24','2000-01-02T11:00:24','5.55','FI',
'2000-01-02T10:00:25','2000-01-02T11:00:25','6.55','FI'
];


// test('database test', ()=> {
//saveSpotData(dataset);

//let pathToDb = path.resolve('..', 'db', 'nibespotter.db');
const db = new database.Db();

// start procedure
db.start();

/*
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
*/

// save data to the database
// db.saveSpotData(dataset);



// too long dataset should not go through
// db.saveSpotData(tooLongDataSet);

// check that saved data is get from database
// db.getSpotData(['2000-01-02T16:00:00','2000-01-02T17:00:00']).then((rows)=>{console.log(rows);});

let mockSpotData = [
    {startTime:"2023-01-11T23:00:00.000Z",endTime:"2023-01-12T00:00:00.000Z",price:"19.88",priceArea:"FI"},
    {startTime:"2023-01-12T00:00:00.000Z",endTime:"2023-01-12T01:00:00.000Z",price:"5.55",priceArea:"FI"},
    {startTime:"2023-01-12T01:00:00.000Z",endTime:"2023-01-12T02:00:00.000Z",price:"4.69",priceArea:"FI"},
    {startTime:"2023-01-12T02:00:00.000Z",endTime:"2023-01-12T03:00:00.000Z",price:"0.10",priceArea:"FI"},
    {startTime:"2023-01-12T03:00:00.000Z",endTime:"2023-01-12T04:00:00.000Z",price:"2.73",priceArea:"FI"},
    {startTime:"2023-01-12T04:00:00.000Z",endTime:"2023-01-12T05:00:00.000Z",price:"24.94",priceArea:"FI"},
    {startTime:"2023-01-12T05:00:00.000Z",endTime:"2023-01-12T06:00:00.000Z",price:"36.01",priceArea:"FI"},
    {startTime:"2023-01-12T06:00:00.000Z",endTime:"2023-01-12T07:00:00.000Z",price:"59.98",priceArea:"FI"},
    {startTime:"2023-01-12T07:00:00.000Z",endTime:"2023-01-12T08:00:00.000Z",price:"65.18",priceArea:"FI"},
    {startTime:"2023-01-12T08:00:00.000Z",endTime:"2023-01-12T09:00:00.000Z",price:"65.03",priceArea:"FI"},
    {startTime:"2023-01-12T09:00:00.000Z",endTime:"2023-01-12T10:00:00.000Z",price:"66.30",priceArea:"FI"},
    {startTime:"2023-01-12T10:00:00.000Z",endTime:"2023-01-12T11:00:00.000Z",price:"66.72",priceArea:"FI"},
    {startTime:"2023-01-12T11:00:00.000Z",endTime:"2023-01-12T12:00:00.000Z",price:"66.60",priceArea:"FI"},
    {startTime:"2023-01-12T12:00:00.000Z",endTime:"2023-01-12T13:00:00.000Z",price:"70.85",priceArea:"FI"},
    {startTime:"2023-01-12T13:00:00.000Z",endTime:"2023-01-12T14:00:00.000Z",price:"73.76",priceArea:"FI"},
    {startTime:"2023-01-12T14:00:00.000Z",endTime:"2023-01-12T15:00:00.000Z",price:"74.44",priceArea:"FI"},
    {startTime:"2023-01-12T15:00:00.000Z",endTime:"2023-01-12T16:00:00.000Z",price:"74.81",priceArea:"FI"},
    {startTime:"2023-01-12T16:00:00.000Z",endTime:"2023-01-12T17:00:00.000Z",price:"76.39",priceArea:"FI"},
    {startTime:"2023-01-12T17:00:00.000Z",endTime:"2023-01-12T18:00:00.000Z",price:"78.65",priceArea:"FI"},
    {startTime:"2023-01-12T18:00:00.000Z",endTime:"2023-01-12T19:00:00.000Z",price:"79.82",priceArea:"FI"},
    {startTime:"2023-01-12T19:00:00.000Z",endTime:"2023-01-12T20:00:00.000Z",price:"74.08",priceArea:"FI"},
    {startTime:"2023-01-12T20:00:00.000Z",endTime:"2023-01-12T21:00:00.000Z",price:"74.50",priceArea:"FI"},
    {startTime:"2023-01-12T21:00:00.000Z",endTime:"2023-01-12T22:00:00.000Z",price:"66.84",priceArea:"FI"},
    {startTime:"2023-01-12T22:00:00.000Z",endTime:"2023-01-12T23:00:00.000Z",price:"42.49",priceArea:"FI"}
]

db.saveSpotData(mockSpotData);

//isTodaysDataSaved().then((res)=>{console.log(res)});

