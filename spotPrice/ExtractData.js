const { getLastSunday, getTomorrow, getMonthWithLeadZero, isSummertime } = require("./DateTimeFunctions.js");

function extractData(json){

    const currentDate = new Date();

    // Last sundays for daylight saving (march and october)
    const marchLastSunday = getLastSunday ( currentDate.getFullYear(), "03" );
    const octoberLastSunday = getLastSunday ( currentDate.getFullYear(), 10 );


    const nextDayDate = getTomorrow( currentDate );
    const day = nextDayDate.getDate();
    const month = getMonthWithLeadZero(nextDayDate);
    const year = nextDayDate.getFullYear();

    // Object for data
    const priceData = [];

    // Not to assume that server forms arrays always the same way (array[0] = "00 - 01").
    // Finding index with date.
    for (let i = 0; i < json.data.Rows.length && i < 25; i++){

        // If it is the last sunday of march and it's 02:00 data has no price value.
        // So we can just skip if CET time is 03:00 when it's 1:00 UTC. Data hour would be 2 and as index i
        // is used as an hour finder, 2 is what we skip.
        if(nextDayDate.getMonth() == 2 && nextDayDate.getDate() == marchLastSunday.getDate() && i == 2) continue;

        // TODO: in October clock is turned backwards at 03:00 CEST and there is two rows with times 02-03.
        // Probably first row with timezone offset +03:00 and the second with +02:00. 

        // Leading zero for hour
        let hour = "0";

        // If hour starts 10 or more no leading zero
        if ( i>9 ) { hour = i; } else { hour += i; }

        // leading zero for day
        let dayString = "0";
        if ( day > 9) {dayString = day;} else { dayString += day;}

        let dateTimeString = `${year}-${month}-${dayString}T${hour}:00:00`;
        let dateString = `${dayString}-${month}-${year}`;

        // Get row index
        let rowIndex = ( json.data.Rows.findIndex( (element)=> element.StartTime == dateTimeString ) );
        if ( rowIndex < 0 ) break;

        // Get column index
        let columnIndex = ( json.data.Rows[rowIndex].Columns.findIndex( (element)=> element.Name == dateString ) );

        // Put data to array
        // We want start time, end time, and price. First we get the start time.

        let timezoneOffsetNordPool = "+01:00";
        let nordPoolDateTimeStart;
        let nordPoolDateTimeEnd;

        // normal time or summer time? If summer time we know that CET offset is +2 hours.
        if( isSummertime(dateTimeString) ){
            timezoneOffsetNordPool = "+02:00";
        }

        // Date objects from data with time zone offset
        nordPoolDateTimeStart = new Date( json.data.Rows[rowIndex].StartTime + timezoneOffsetNordPool );
        nordPoolDateTimeEnd = new Date( json.data.Rows[rowIndex].EndTime + timezoneOffsetNordPool );

        priceData.push( nordPoolDateTimeStart.toISOString() );
        priceData.push( nordPoolDateTimeEnd.toISOString()  );
        priceData.push( json.data.Rows[rowIndex].Columns[columnIndex].Value.replace(",", ".") );

        // 
        // if (i == 2 && json.data.Rows[ rowIndex + 1 ].StartTime == dateTimeString){
        //     let nordPoolDateTimeStartExtra = ( new Date( json.data.Rows[rowIndex + 1 ].StartTime + "+01:00" ) );
        //     let nordPoolDateTimeEndExtra = new Date( json.data.Rows[rowIndex + 1 ].EndTime + "+01:00" );
        //     priceData.push( nordPoolDateTimeStartExtra );
        //     priceData.push( nordPoolDateTimeEndExtra );
        //     priceData.push( json.data.Rows[rowIndex + 1].Columns[columnIndex].Value.replace(",", ".") );
        // }
            
    }
    
    return priceData;
}
module.exports={extractData}