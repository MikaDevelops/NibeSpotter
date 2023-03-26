/** DateTime related functions */

/**
 * Returns a Date object with date set to last Sunday of the given month.
 * @param {*} year number or string to be used as year.
 * @param {*} month should be string if leading zero needed
 * @returns Date object with the last Sunday set as date.
 */
function getLastSunday ( year, month ) {

    let date = new Date( year + "-" + month + "-31T00:00:00.000Z" );
    let lastSunday = new Date (date.setDate(date.getDate()-date.getDay()));
    
    if(month == 10){
        lastSunday.setTime(lastSunday.getTime() + 3600000);
    }else {
        lastSunday.setUTCHours(0,0,0,0);
    }

    return lastSunday;

}

/**
 * Adds 24 hours to given Date object and returns object.
 * @param {Date} current Date object
 * @returns 
 */
function getTomorrow ( current ) {
    let tomorrow = new Date( current.valueOf() + 86400000 );
    return tomorrow;
}

/**
 * Adds one to month index and leading zero if month is before october (under 10)
 * to be used in DateTime strings.
 * @param {*} date Date object to get the month index
 * @returns month number in string
 */
function getMonthWithLeadZero (date) {
    let monthZero = "0";
    let monthString = "";
    let month = date.getMonth() + 1;
    if (month > 9) { 
        return monthString + month;
     } else {
        return monthZero + month;
     }
}

module.exports = {getLastSunday, getTomorrow, getMonthWithLeadZero}