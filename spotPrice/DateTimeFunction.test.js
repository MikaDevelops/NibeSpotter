const { getLastSunday } =require( './DateTimeFunctions.js');

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