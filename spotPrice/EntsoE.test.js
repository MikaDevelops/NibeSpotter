require('dotenv').config({path: './.env'});

    const {EntsoE} = require('./EntsoE.js');
    const {entsoData} = require('./__mocks__/entsoEdata.js');
    const entsoE = new EntsoE(process.env.ENTSOE_TOKEN);

test ('datetimestring forms right with less than 10 values', ()=>{
    const result = entsoE.makePeriodString(new Date('2024-02-01T01:01:01.000'));
    expect(result).toEqual('202402010101');

    const result9 = entsoE.makePeriodString(new Date('2029-09-09T09:09:09.000'));
    expect(result9).toEqual('202909090909');
});

test ('datetimestring forms right with 10 values or greater',()=>{
    const result10 = entsoE.makePeriodString(new Date('2024-10-10T10:10:10'));
    expect(result10).toEqual('202410101010');

    const result23 = entsoE.makePeriodString(new Date('2024-12-31T23:59:59'));
    expect(result23).toEqual('202412312359');
});

test ('extractPriceData-method returns data in object array', ()=>{
    const expected = [
        {startTime: 1708383600, endTime: 1708387200, price: 46.97, priceArea: 'FI'},
        {startTime: 1708387200, endTime: 1708390800, price: 44.95, priceArea: 'FI'},
        {startTime: 1708390800, endTime: 1708394400, price: 43.04, priceArea: 'FI'},
        {startTime: 1708394400, endTime: 1708398000, price: 42.27, priceArea: 'FI'},
        {startTime: 1708398000, endTime: 1708401600, price: 43.23, priceArea: 'FI'},
        {startTime: 1708401600, endTime: 1708405200, price: 52.35, priceArea: 'FI'},
        {startTime: 1708405200, endTime: 1708408800, price: 59.93, priceArea: 'FI'},
        {startTime: 1708408800, endTime: 1708412400, price: 85.66, priceArea: 'FI'},
        {startTime: 1708412400, endTime: 1708416000, price: 88.71, priceArea: 'FI'},
        {startTime: 1708416000, endTime: 1708419600, price: 77.78, priceArea: 'FI'},
        {startTime: 1708419600, endTime: 1708423200, price: 80.22, priceArea: 'FI'},
        {startTime: 1708423200, endTime: 1708426800, price: 93.01, priceArea: 'FI'},
        {startTime: 1708426800, endTime: 1708430400, price: 90.13, priceArea: 'FI'},
        {startTime: 1708430400, endTime: 1708434000, price: 83.05, priceArea: 'FI'},
        {startTime: 1708434000, endTime: 1708437600, price: 80.38, priceArea: 'FI'},
        {startTime: 1708437600, endTime: 1708441200, price: 75.04, priceArea: 'FI'},
        {startTime: 1708441200, endTime: 1708444800, price: 91.09, priceArea: 'FI'},
        {startTime: 1708444800, endTime: 1708448400, price: 93.07, priceArea: 'FI'},
        {startTime: 1708448400, endTime: 1708452000, price: 92.27, priceArea: 'FI'},
        {startTime: 1708452000, endTime: 1708455600, price: 70.01, priceArea: 'FI'},
        {startTime: 1708455600, endTime: 1708459200, price: 55.00, priceArea: 'FI'},
        {startTime: 1708459200, endTime: 1708462800, price: 53.65, priceArea: 'FI'},
        {startTime: 1708462800, endTime: 1708466400, price: 41.90, priceArea: 'FI'},
        {startTime: 1708466400, endTime: 1708470000, price: 36.01, priceArea: 'FI'},

        {startTime: 1708470000, endTime: 1708473600, price: 37.37, priceArea: 'FI'},
        {startTime: 1708473600, endTime: 1708477200, price: 36.79, priceArea: 'FI'},
        {startTime: 1708477200, endTime: 1708480800, price: 36.82, priceArea: 'FI'},
        {startTime: 1708480800, endTime: 1708484400, price: 36.82, priceArea: 'FI'},
        {startTime: 1708484400, endTime: 1708488000, price: 37.95, priceArea: 'FI'},
        {startTime: 1708488000, endTime: 1708491600, price: 39.02, priceArea: 'FI'},
        {startTime: 1708491600, endTime: 1708495200, price: 42.74, priceArea: 'FI'},
        {startTime: 1708495200, endTime: 1708498800, price: 53.39, priceArea: 'FI'},
        {startTime: 1708498800, endTime: 1708502400, price: 55.30, priceArea: 'FI'},
        {startTime: 1708502400, endTime: 1708506000, price: 56.18, priceArea: 'FI'},
        {startTime: 1708506000, endTime: 1708509600, price: 55.56, priceArea: 'FI'},
        {startTime: 1708509600, endTime: 1708513200, price: 55.35, priceArea: 'FI'},
        {startTime: 1708513200, endTime: 1708516800, price: 51.74, priceArea: 'FI'},
        {startTime: 1708516800, endTime: 1708520400, price: 49.99, priceArea: 'FI'},
        {startTime: 1708520400, endTime: 1708524000, price: 51.62, priceArea: 'FI'},
        {startTime: 1708524000, endTime: 1708527600, price: 50.64, priceArea: 'FI'},
        {startTime: 1708527600, endTime: 1708531200, price: 52.82, priceArea: 'FI'},
        {startTime: 1708531200, endTime: 1708534800, price: 55.74, priceArea: 'FI'},
        {startTime: 1708534800, endTime: 1708538400, price: 54.85, priceArea: 'FI'},
        {startTime: 1708538400, endTime: 1708542000, price: 52.68, priceArea: 'FI'},
        {startTime: 1708542000, endTime: 1708545600, price: 46.03, priceArea: 'FI'},
        {startTime: 1708545600, endTime: 1708549200, price: 41.14, priceArea: 'FI'},
        {startTime: 1708549200, endTime: 1708552800, price: 39.37, priceArea: 'FI'},
        {startTime: 1708552800, endTime: 1708556400, price: 34.38, priceArea: 'FI'}
    ];

    const result = entsoE.extractPriceData(entsoData);

    expect(result).toEqual(expected);  
}); 

// TODO: fetchData-method trows error / returns empty array and logs error