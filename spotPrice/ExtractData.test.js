const {extractData} = require('./ExtractData.js');
const {mockData} = require('./__mocks__/mockData.js');

test('extract data test', ()=> {
    
    

    let MockDate = require('mockdate');
    MockDate.set(1673442000000);

    expect (extractData(mockData)).toBe([1,2,3]);

    MockDate.reset();

});