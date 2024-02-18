require('dotenv').config({path: './.env'});

//test('Fetch data using Entso-E API',async ()=>{
    const {EntsoE} = require('./EntsoE.js');
    const entsoE = new EntsoE(process.env.ENTSOE_TOKEN);

//});

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