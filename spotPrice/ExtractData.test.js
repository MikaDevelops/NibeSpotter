const {extractData} =               require('./ExtractData.js');
const {mockData} =                  require('./__mocks__/mockData.js');
const {mockData2} =                 require('./__mocks__/mockData2.js');
const {mockDataDayLightMarch} =     require('./__mocks__/mockDataDayLightMarch.js');
const {mockDataDayLightOctober} =   require('./__mocks__/mockDataDayLightOct.js');

test('extract data test 01 January 2024 15:00 EET', ()=>{
    let MockDate = require('mockdate');
    // 1st January 2024
    MockDate.set(1704027600000);

    let expectedData = [
        {startTime:"2023-12-31T23:00:00.000Z",endTime:"2024-01-01T00:00:00.000Z",price:"19.88",priceArea:"FI"},
        {startTime:"2024-01-01T00:00:00.000Z",endTime:"2024-01-01T01:00:00.000Z",price:"5.55",priceArea:"FI"}
    ]

    expect(extractData(mockData2)).toEqual(expectedData);

    MockDate.reset();
});

test('extract data test 11th January 2023 15:00 EET', ()=> {

    let MockDate = require('mockdate');

    // 11th January 2023
    MockDate.set(1673442000000);

    let expectedData = [
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

    expect (extractData(mockData)).toEqual(expectedData);

    MockDate.reset();

});


test('extract data test 26th March 2023 daylight saving kicks in', ()=> {

    let MockDate = require('mockdate');

    // 25th March 2023 14:00 EET
    MockDate.set(1679745600000);
   
    let expectedData = [
        {startTime:"2023-03-25T23:00:00.000Z",endTime:"2023-03-26T00:00:00.000Z",price:"39.66",priceArea:"FI"},
        {startTime:"2023-03-26T00:00:00.000Z",endTime:"2023-03-26T01:00:00.000Z",price:"39.23",priceArea:"FI"},
        {startTime:"2023-03-26T01:00:00.000Z",endTime:"2023-03-26T02:00:00.000Z",price:"40.12",priceArea:"FI"},
        {startTime:"2023-03-26T02:00:00.000Z",endTime:"2023-03-26T03:00:00.000Z",price:"40.88",priceArea:"FI"},
        {startTime:"2023-03-26T03:00:00.000Z",endTime:"2023-03-26T04:00:00.000Z",price:"40.43",priceArea:"FI"},
        {startTime:"2023-03-26T04:00:00.000Z",endTime:"2023-03-26T05:00:00.000Z",price:"41.00",priceArea:"FI"},
        {startTime:"2023-03-26T05:00:00.000Z",endTime:"2023-03-26T06:00:00.000Z",price:"41.75",priceArea:"FI"},
        {startTime:"2023-03-26T06:00:00.000Z",endTime:"2023-03-26T07:00:00.000Z",price:"43.39",priceArea:"FI"},
        {startTime:"2023-03-26T07:00:00.000Z",endTime:"2023-03-26T08:00:00.000Z",price:"47.66",priceArea:"FI"},
        {startTime:"2023-03-26T08:00:00.000Z",endTime:"2023-03-26T09:00:00.000Z",price:"49.62",priceArea:"FI"},
        {startTime:"2023-03-26T09:00:00.000Z",endTime:"2023-03-26T10:00:00.000Z",price:"50.01",priceArea:"FI"},
        {startTime:"2023-03-26T10:00:00.000Z",endTime:"2023-03-26T11:00:00.000Z",price:"46.37",priceArea:"FI"},
        {startTime:"2023-03-26T11:00:00.000Z",endTime:"2023-03-26T12:00:00.000Z",price:"43.30",priceArea:"FI"},
        {startTime:"2023-03-26T12:00:00.000Z",endTime:"2023-03-26T13:00:00.000Z",price:"44.25",priceArea:"FI"},
        {startTime:"2023-03-26T13:00:00.000Z",endTime:"2023-03-26T14:00:00.000Z",price:"43.08",priceArea:"FI"},
        {startTime:"2023-03-26T14:00:00.000Z",endTime:"2023-03-26T15:00:00.000Z",price:"48.35",priceArea:"FI"},
        {startTime:"2023-03-26T15:00:00.000Z",endTime:"2023-03-26T16:00:00.000Z",price:"62.37",priceArea:"FI"},
        {startTime:"2023-03-26T16:00:00.000Z",endTime:"2023-03-26T17:00:00.000Z",price:"61.98",priceArea:"FI"},
        {startTime:"2023-03-26T17:00:00.000Z",endTime:"2023-03-26T18:00:00.000Z",price:"54.84",priceArea:"FI"},
        {startTime:"2023-03-26T18:00:00.000Z",endTime:"2023-03-26T19:00:00.000Z",price:"45.58",priceArea:"FI"},
        {startTime:"2023-03-26T19:00:00.000Z",endTime:"2023-03-26T20:00:00.000Z",price:"44.18",priceArea:"FI"},
        {startTime:"2023-03-26T20:00:00.000Z",endTime:"2023-03-26T21:00:00.000Z",price:"40.87",priceArea:"FI"},
        {startTime:"2023-03-26T21:00:00.000Z",endTime:"2023-03-26T22:00:00.000Z",price:"39.11",priceArea:"FI"}
    ] 

    expect (extractData(mockDataDayLightMarch)).toEqual(expectedData);


    MockDate.reset();

});

test('extract data test 28th October 2023 daylight saving kicks out', ()=> {

    let MockDate = require('mockdate');

    // 28th October 2023 14:00 EEST
    MockDate.set(1698490800000);

    let expectedData = [
        {startTime:'2023-10-28T22:00:00.000Z',endTime:'2023-10-28T23:00:00.000Z',price:'34.33',priceArea:'FI'},
        {startTime:'2023-10-28T23:00:00.000Z',endTime:'2023-10-29T00:00:00.000Z',price:'27.19',priceArea:'FI'},
        {startTime:'2023-10-29T00:00:00.000Z',endTime:'2023-10-29T01:00:00.000Z',price:'25.34',priceArea:'FI'},
        {startTime:'2023-10-29T01:00:00.000Z',endTime:'2023-10-29T02:00:00.000Z',price:'22.35',priceArea:'FI'},
        {startTime:'2023-10-29T02:00:00.000Z',endTime:'2023-10-29T03:00:00.000Z',price:'21.15',priceArea:'FI'},
        {startTime:'2023-10-29T03:00:00.000Z',endTime:'2023-10-29T04:00:00.000Z',price:'21.95',priceArea:'FI'},
        {startTime:'2023-10-29T04:00:00.000Z',endTime:'2023-10-29T05:00:00.000Z',price:'22.83',priceArea:'FI'},
        {startTime:'2023-10-29T05:00:00.000Z',endTime:'2023-10-29T06:00:00.000Z',price:'25.01',priceArea:'FI'},
        {startTime:'2023-10-29T06:00:00.000Z',endTime:'2023-10-29T07:00:00.000Z',price:'25.54',priceArea:'FI'},
        {startTime:'2023-10-29T07:00:00.000Z',endTime:'2023-10-29T08:00:00.000Z',price:'24.28',priceArea:'FI'},
        {startTime:'2023-10-29T08:00:00.000Z',endTime:'2023-10-29T09:00:00.000Z',price:'23.93',priceArea:'FI'},
        {startTime:'2023-10-29T09:00:00.000Z',endTime:'2023-10-29T10:00:00.000Z',price:'23.34',priceArea:'FI'},
        {startTime:'2023-10-29T10:00:00.000Z',endTime:'2023-10-29T11:00:00.000Z',price:'23.70',priceArea:'FI'},
        {startTime:'2023-10-29T11:00:00.000Z',endTime:'2023-10-29T12:00:00.000Z',price:'23.09',priceArea:'FI'},
        {startTime:'2023-10-29T12:00:00.000Z',endTime:'2023-10-29T13:00:00.000Z',price:'22.42',priceArea:'FI'},
        {startTime:'2023-10-29T13:00:00.000Z',endTime:'2023-10-29T14:00:00.000Z',price:'22.97',priceArea:'FI'},
        {startTime:'2023-10-29T14:00:00.000Z',endTime:'2023-10-29T15:00:00.000Z',price:'34.25',priceArea:'FI'},
        {startTime:'2023-10-29T15:00:00.000Z',endTime:'2023-10-29T16:00:00.000Z',price:'60.66',priceArea:'FI'},
        {startTime:'2023-10-29T16:00:00.000Z',endTime:'2023-10-29T17:00:00.000Z',price:'65.83',priceArea:'FI'},
        {startTime:'2023-10-29T17:00:00.000Z',endTime:'2023-10-29T18:00:00.000Z',price:'58.69',priceArea:'FI'},
        {startTime:'2023-10-29T18:00:00.000Z',endTime:'2023-10-29T19:00:00.000Z',price:'44.11',priceArea:'FI'},
        {startTime:'2023-10-29T19:00:00.000Z',endTime:'2023-10-29T20:00:00.000Z',price:'40.88',priceArea:'FI'},
        {startTime:'2023-10-29T20:00:00.000Z',endTime:'2023-10-29T21:00:00.000Z',price:'34.28',priceArea:'FI'},
        {startTime:'2023-10-29T21:00:00.000Z',endTime:'2023-10-29T22:00:00.000Z',price:'30.30',priceArea:'FI'},
        {startTime:'2023-10-29T22:00:00.000Z',endTime:'2023-10-29T23:00:00.000Z',price:'24.59',priceArea:'FI'}
    ] 
    expect (extractData(mockDataDayLightOctober)).toEqual(expectedData);


    MockDate.reset();

});