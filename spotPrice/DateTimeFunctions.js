/** DateTime related functions */

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

function getTomorrow ( current ) {
    let tomorrow = new Date( current.valueOf() + 86400000 );
    return tomorrow;
}

function getMonthWithLeadZero (date) {
    let monthZero = "0";
    let month = date.getMonth() + 1;
    if (month > 9) { 
        return month;
     } else {
        return monthZero + month;
     }
}

module.exports = {getLastSunday, getTomorrow, getMonthWithLeadZero}