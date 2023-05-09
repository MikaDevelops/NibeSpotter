require('dotenv').config({path: '../.env'});
const {saveSpotData} = require('./databaseOperations.js');

let dataset = ['2000-01-02T16:00:00','2000-01-02T17:00:00','6.66',
'2000-01-02T17:00:00','2000-01-02T17:00:00','6.67',
'2000-01-02T18:00:00','2000-01-02T17:00:00','6.68'];



// test('database test', ()=> {

saveSpotData(dataset);




// });


