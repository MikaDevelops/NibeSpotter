const { getLastSunday, getTomorrow, getMonthWithLeadZero, isSummertime } = require( './DateTimeFunctions.js');


test('DateTimeFunction getLastSunday test',()=>{
    
    let testData = [
        [2004,'02'],
        [2023,'03'],
        ['2023','07'],
        ['2023','10']
    ];

    let expectedDates = [
        '2004-02-29T00:00:00.000Z',
        '2023-03-26T00:00:00.000Z',
        '2023-07-30T00:00:00.000Z',
        '2023-10-29T00:00:00.000Z'
    ];
    expect( getLastSunday(testData[0][0], testData[0][1]) ).toEqual(new Date(expectedDates[0]));
    expect( getLastSunday(testData[1][0], testData[1][1]) ).toEqual(new Date(expectedDates[1]));
    expect( getLastSunday(testData[2][0], testData[2][1]) ).toEqual(new Date(expectedDates[2]));
    expect( getLastSunday(testData[3][0], testData[3][1]) ).toEqual(new Date(expectedDates[3]));
});

test('DateTimeFunction getTomorrow test', ()=>{



    let testData = [
        new Date('2023-03-01T12:30:00.000'),
        new Date('2023-03-01T00:00:00.000')
    ];

    let expectedDates = [
        new Date('2023-03-02T12:30:00.000'),
        new Date('2023-03-02T00:00:00.000')
    ]

    expect(getTomorrow(testData[0])).toEqual(expectedDates[0]);
    expect(getTomorrow(testData[1])).toEqual(expectedDates[1]);

});

test('DateTimeFunction getMonthWithLeadZero test', ()=>{

    // Month num. 1, 9, 10 (indexes 0, 8, 9)
    let testData = [
        new Date('2023-01-01'),
        new Date('2023-09-01'),
        new Date('2023-10-01'),
    ];

    let expectedData =[
        '01',
        '09',
        '10'
    ];

    expect(getMonthWithLeadZero(testData[0])).toEqual(expectedData[0]);
    expect(getMonthWithLeadZero(testData[1])).toEqual(expectedData[1]);
    expect(getMonthWithLeadZero(testData[2])).toEqual(expectedData[2]);

});

test('DateTimeFunction isSummerTime test', ()=>{

    let testData = [
        '2023-03-26T01:59:59.000Z',
        '2023-03-26T02:this should not stop function from working',
        '2023-03-29T02:59:59',
        '2023-03-29T03:00:00',
        '2023-01-01T03:00:00'

    ];

    let expectedData =[

        false,
        true,
        true,
        false,
        false,
        
    ];

    expect(isSummertime(testData[0])).toBe(expectedData[0]);
    expect(isSummertime(testData[1])).toBe(expectedData[1]);
    expect(isSummertime(testData[2])).toBe(expectedData[2]);
    expect(isSummertime(testData[3])).toBe(expectedData[3]);


});