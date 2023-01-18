const {extractData} = require('./ExtractData.js');

test('extract data test', ()=> {
    
    let MockDate = require('mockdate');
    MockDate.set(1673442000000);
    console.log(new Date());
    //extractData()

    MockDate.reset();

});