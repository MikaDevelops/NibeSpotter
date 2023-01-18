function extractData(json){

    /* ******************** DateTime related functions ******************** */
    
    // Returns last sunday of month (1AM UTC). Month parameter 1-12.
    const getLastSunday = ( year, month )=> {
        let date = new Date( year + "-" + month + "-31T01:00:00.000Z" );
        let lastSunday = new Date (date.setDate(date.getDate()-date.getDay()));
        return lastSunday;
    }

    // Get the date for tomorrow.
    const getTomorrow = ( current )=> {
        let tomorrow = new Date(current);
        tomorrow.setDate( tomorrow.getDate() + 1 );
        return tomorrow;
    }

    // Month number 1-12 with leading zero from month index
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
    const marchLastSunday = getLastSunday ( currentDate.getFullYear(), 3 );
    const octoberLastSunday = getLastSundayMarch ( currentDate.getFullYear(), 10 );

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

        // Get column index for current day
        let columnIndex = ( json.data.Rows[rowIndex].Columns.findIndex( (element)=> element.Name == dateString ) );

        // Put data to object
        // We want start time, end time, and price. First we get the start time.

        // // subtract hours from date
        // const subtractHours = (date, hoursToSubtract)=> {
        //     let result = new Date( date );
        //     result.setHours(result.getHours()-hoursToSubtract);
        //     return result;
        // }

        // It's summertime
        if ( nextDayDate.setHours(3,0,0,0).valueOf() >= marchLastSunday.valueOf() 
        && nextDayDate.setHours(3,0,0,0).valueOf() < octoberLastSunday.valueOf() ){

        }
        
        // day of turning clock backwards at 0200 CET on last Sunday of October
        if (nextDayDate.getDate() == octoberLastSunday.getDate() 
            && nextDayDate.getMonth() == octoberLastSunday.getMonth() 
            && i == 2
            && rowIndex != -1)
            {
                const dataFirstHour = [];
                const dataSecondHour = [];

                let nordPoolDateTimeStart = new Date( json.data.Rows[rowIndex].StartTime + "+01:00" );
                let nordPoolDateTimeEnd = new Date( json.data.Rows[rowIndex].EndTime + "+01:00" );
                dataFirstHour.push( nordPoolDateTimeStart.toISOString() );
                dataFirstHour.push( nordPoolDateTimeEnd.toISOString()  );
                dataFirstHour.push( json.data.Rows[rowIndex].Columns[columnIndex].Value );

                
                if (json.data.Rows[ rowIndex + 1 ].StartTime == dateTimeString){
                    let nordPoolDateTimeStartExtra = ( new Date( json.data.Rows[rowIndex + 1 ].StartTime ) );
                    let nordPoolDateTimeEndExtra = new Date( json.data.Rows[rowIndex + 1 ].EndTime );
                    dataSecondHour.push( subtractHours( nordPoolDateTimeStartExtra, 1 ) );
                    dataSecondHour.push( subtractHours( nordPoolDateTimeEndExtra, 1 ) );
                    dataSecondHour.push( json.data.Rows[rowIndex + 1].Columns[columnIndex].Value );
                }

                priceData.push( dataFirstHour );
                priceData.push( dataSecondHour );
        
        // If next day is last day of 
        } else if ( nextDayDate.getDate() == marchLastSunday.getDate() 
            && nextDayDate.getMonth() == marchLastSunday.getMonth()

        ){

        }

    }
}
module.exports={extractData}