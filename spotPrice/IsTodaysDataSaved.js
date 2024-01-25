const { Db } = require("../dataBase/Db");
const { getTomorrow,getMonthWithLeadZero } = require("./DateTimeFunctions");

async function isTodaysDataSaved() {

    const today = new Date();
    const tomorrow = getTomorrow(today);
    tomorrow.setHours(12,0,0,0);
    const dateString = 
        tomorrow.getFullYear() + '-'
        + getMonthWithLeadZero(tomorrow) + '-'
        + tomorrow.getDate() + 'T12:00:00';

    const db = new Db();
    db.start();

    const previousData = await db.getSpotData([dateString]);

    if (previousData.length > 0) {
            let date = new Date(previousData[0].startTime)
            if(date.valueOf() == tomorrow.valueOf()) return true;
    }
    return false;
}

module.exports={isTodaysDataSaved};