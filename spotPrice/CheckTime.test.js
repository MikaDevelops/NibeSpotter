test ('CheckTime returns false when time before given time',()=>{
    const checkTime = require('./CheckTime.js');

    let mockDateTime = require('mockdate');
    // 13th January 2024 UTC 15:59 (17:59 EET)
    mockDateTime.set(1705154340000);

    // 17:59 is before 18:00 ->false
    let time = 18;
    let result = checkTime.isClockAfter(time);

    expect(result).toEqual(false);

    mockDateTime.reset();

});

test ('CheckTime returns true when time after given time',()=>{
    const checkTime = require('./CheckTime.js');

    let mockDateTime = require('mockdate');
    // 13th January 2024 UTC 14:01 (18:01 EET)
    mockDateTime.set(1705154460000);

    // after 16:01 is after 16:00 -> true
    let time = 16;
    let result = checkTime.isClockAfter(time);

    expect(result).toEqual(true);

    mockDateTime.reset();
})