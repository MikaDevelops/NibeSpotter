/** DateTime related functions */

const getLastSunday = (year, month) => {

    let date = new Date( year + "-" + month + "-31T00:00:00.000Z" );
    let lastSunday = new Date (date.setDate(date.getDate()-date.getDay()));
    
    if(month == 10){
        lastSunday.setTime(lastSunday.getTime() + 3600000);
    }else {
        lastSunday.setUTCHours(0,0,0,0);
    }

    return lastSunday;

}

module.exports = {getLastSunday}