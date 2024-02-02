beforeEach(()=>{
    return { SpotPrice } = require("./SpotPrice");
});

test('Time of update not exactly 2 parameter raises error', ()=>{

    expect(()=>{
        const timeForUpdate = [3,5,6];
        new SpotPrice(timeForUpdate);
    
    }).toThrow('Not exactly 2 parameters given');

    expect(()=>{
        const timeForUpdate = [3];
        new SpotPrice(timeForUpdate);
    
    }).toThrow('Not exactly 2 parameters given');

});

test('Time of update non-integer values raises error',()=>{

    expect(()=>{

        const timeForUpdate = [3,5.3];
        new SpotPrice(timeForUpdate);

    }).toThrow('Not number parameter given');

    expect(()=>{

        const timeForUpdate = [3,"5"];
        new SpotPrice(timeForUpdate);

    }).toThrow('Not number parameter given');

});

test('Invalid time paramters raises error',()=>{

    expect(()=>{
        const timeForUpdate = [-3,5];
        new SpotPrice(timeForUpdate);
    }).toThrow('Negative number given.');

    expect(()=>{
        const timeForUpdate = [24,6];
        new SpotPrice(timeForUpdate);
    }).toThrow('Hour cannot be over 23.');

    expect(()=>{
        const timeForUpdate = [6,60];
        new SpotPrice(timeForUpdate);
    }).toThrow('Minutes cannot be over 59.');

});

test('Time difference', ()=>{

    const checkTime = require('./CheckTime.js');
    let mockDateTime = require('mockdate');

/* Winter time (normal time) */

    // 28th January 2024 UTC 11:44 (13:44 EET)
    mockDateTime.set(1706442240000);

    let timeBefore = new Date('2024-01-28T13:44:00');
    let timeForUpdate = [11,45];
    const spotPrice = new SpotPrice(timeForUpdate);
    let timediff1 = spotPrice.countTimeDifferenceToUpdate(timeBefore);
    expect(timediff1).toEqual(60000);

    timeAfter = new Date('2024-01-28T13:46');
    let timediff2 = spotPrice.countTimeDifferenceToUpdate(timeAfter);
    expect(timediff2).toEqual(86340000);

    timeExact = new Date('2024-01-28T13:45');
    let timediff3 = spotPrice.countTimeDifferenceToUpdate(timeExact);
    expect(timediff3).toEqual(0);

    timeInThereshold = new Date('2024-01-28T13:45:04.999');
    let timeDiff4 = spotPrice.countTimeDifferenceToUpdate(timeInThereshold);
    expect(timeDiff4).toEqual(10000);

/* Summer time (daylight saving) */

    // 28th April 2024 UTC 11:44 (13:44 EET)
    mockDateTime.set(1714301040000);

    timeBefore = new Date('2024-04-28T14:44:00');
    timediff1 = spotPrice.countTimeDifferenceToUpdate(timeBefore);
    expect(timediff1).toEqual(60000);

    timeAfter = new Date('2024-04-28T14:46');
    timediff2 = spotPrice.countTimeDifferenceToUpdate(timeAfter);
    expect(timediff2).toEqual(86340000);

    timeExact = new Date('2024-04-28T14:45');
    timediff3 = spotPrice.countTimeDifferenceToUpdate(timeExact);
    expect(timediff3).toEqual(0);

    timeInThereshold = new Date('2024-04-28T14:45:04.999');
    timeDiff4 = spotPrice.countTimeDifferenceToUpdate(timeInThereshold);
    expect(timeDiff4).toEqual(10000);

    mockDateTime.reset();
});