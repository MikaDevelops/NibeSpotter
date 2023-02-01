const { getLastSunday } = require("./DateTimeFunctions.js");

function extractData(json){

    /* ******************** DateTime related functions ******************** */
    
    // Returns last sunday of month (00:00 UTC). Month parameter 1-12.
   /*  const getLastSunday = ( year, month )=> {
        let date = new Date( year + "-" + month + "-31T00:00:00.000Z" );
        let lastSunday = new Date (date.setDate(date.getDate()-date.getDay()));
        return lastSunday;
    } */

    // Get the date for tomorrow.
    const getTomorrow = ( current )=> {
        let tomorrow = new Date( current.valueOf() + 86400000 );
        return tomorrow;
    }

    // Returns month number 1-12 with leading zero from month index
    const getMonthWithLeadZero = ()=> {
        let monthZero = "0";
        let month = nextDayDate.getMonth() + 1;
        if (month > 9) { 
            return month;
         } else {
            return monthZero + month;
         }
    }
    /* ******************************************************************** */

    const currentDate = new Date();

    // Last sundays for daylight saving (march and october)
    const marchLastSunday = getLastSunday ( currentDate.getFullYear(), "03" );

    const octoberLastSunday = getLastSunday ( currentDate.getFullYear(), 10 );

    const nextDayDate = getTomorrow( currentDate );
    const day = nextDayDate.getDate();
    const month = getMonthWithLeadZero();
    const year = nextDayDate.getFullYear();

    // Object for data
    const priceData = [];

    // Not to assume that server forms arrays always the same way (array[0] = "00 - 01").
    // Finding index with date.
    for (let i = 0; i < json.data.Rows.length && i < 25; i++){

        // Leading zero
        let hour = "0";

        // If hour starts 10 or more no leading zero
        if ( i>9 ) { hour = i; } else { hour += i; }

        let dateTimeString = `${year}-${month}-${day}T${hour}:00:00`;
        let dateString = `${day}-${month}-${year}`;

        // Get row index for current day and time
        let rowIndex = ( json.data.Rows.findIndex( (element)=> element.StartTime == dateTimeString ) );
        if ( rowIndex < 0 ) break;

        // Get column index for current day
        let columnIndex = ( json.data.Rows[rowIndex].Columns.findIndex( (element)=> element.Name == dateString ) );

        // Put data to array
        // We want start time, end time, and price. First we get the start time.

        let timezoneOffsetNordPool;
        let nordPoolDateTimeStart;
        let nordPoolDateTimeEnd;

        if( nextDayDate.setUTCHours(0,0,0,0).valueOf() < marchLastSunday.valueOf()){
            
            timezoneOffsetNordPool = '+01:00';

        }else if(nextDayDate.setUTCHours(0,0,0,0).valueOf() > marchLastSunday.valueOf()
        && nextDayDate.setUTCHours(0,0,0,0).valueOf() < octoberLastSunday.valueOf()){

            timezoneOffsetNordPool = '+02:00';

        }else if(nextDayDate.setUTCHours(0,0,0,0).valueOf() == marchLastSunday.valueOf() && i > 1){

            timezoneOffsetNordPool = '+02:00';

        }else if(nextDayDate.setUTCHours(0,0,0,0).valueOf() == marchLastSunday.valueOf() && i < 2){

            timezoneOffsetNordPool = '+01:00';

        }else if(nextDayDate.setUTCHours(0,0,0,0).valueOf() == octoberLastSunday.valueOf() && i > 2){

            timezoneOffsetNordPool = '+01:00';

        }else if(nextDayDate.setUTCHours(0,0,0,0).valueOf() == octoberLastSunday.valueOf() && i < 3){

            timezoneOffsetNordPool = '+02:00';

        }else if( nextDayDate.setUTCHours(0,0,0,0).valueOf() > marchLastSunday.valueOf()
                    && nextDayDate.setUTCHours(0,0,0,0).valueOf() < octoberLastSunday.valueOf()){

            timezoneOffsetNordPool = '+02:00';

        }

        nordPoolDateTimeStart = new Date( json.data.Rows[rowIndex].StartTime + timezoneOffsetNordPool );
        nordPoolDateTimeEnd = new Date( json.data.Rows[rowIndex].EndTime + timezoneOffsetNordPool );

        priceData.push( nordPoolDateTimeStart.toISOString() );
        priceData.push( nordPoolDateTimeEnd.toISOString()  );
        priceData.push( json.data.Rows[rowIndex].Columns[columnIndex].Value.replace(",", ".") );

        if (i == 2 && json.data.Rows[ rowIndex + 1 ].StartTime == dateTimeString){
            let nordPoolDateTimeStartExtra = ( new Date( json.data.Rows[rowIndex + 1 ].StartTime + "+01:00" ) );
            let nordPoolDateTimeEndExtra = new Date( json.data.Rows[rowIndex + 1 ].EndTime + "+01:00" );
            priceData.push( nordPoolDateTimeStartExtra );
            priceData.push( nordPoolDateTimeEndExtra );
            priceData.push( json.data.Rows[rowIndex + 1].Columns[columnIndex].Value.replace(",", ".") );
        }
            
    }
    
    return priceData;
}
module.exports={extractData}