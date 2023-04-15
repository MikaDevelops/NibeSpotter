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
 * @returns 24 hours added Date object
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

/**
 * Checks date string is in summertime period.
 * @param {string} dateString string to be checked (YYYY-MM-DDT00:00:00)
 * @returns boolean
 */
function isSummertime(dateString){

    const date = dateString.split('T')[0].split('-');
    const time = dateString.split('T')[1].split(':');

    // get the last sundays of march and october for the year
    const marchLastSunday = getLastSunday(date[0], '03');
    const octoberLastSunday = getLastSunday(date[0], '10');

    // to ease thing out lets make comparison numbers
    const dateNum = Number( dateString.split('T')[0].split('-')[0] 
        + dateString.split('T')[0].split('-')[1] 
        + dateString.split('T')[0].split('-')[2]
        + dateString.split('T')[1].split(':')[0] );
    const marchNum =  Number(date[0].toString()+ date[1].toString() + marchLastSunday.getDate().toString()+'02') ;
    const octoberNum =  Number(date[0].toString()+ date[1].toString() + octoberLastSunday.getDate().toString()+'03');

    // compare if date string is in between march last sun. 02:00 and oct last sun 02:59:59
    if ( dateNum >= marchNum && dateNum < octoberNum ) return true; 
    return false;
}

module.exports = {getLastSunday, getTomorrow, getMonthWithLeadZero, isSummertime}