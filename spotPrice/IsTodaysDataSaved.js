const { Db } = require("../dataBase/Db");
const { getTomorrow } = require("./DateTimeFunctions");

async function isTodaysDataSaved() {

    const today = new Date();
    const tomorrow = getTomorrow(today);
    tomorrow.setHours(12,0,0,0);

    const db = new Db();
    db.start();

    const previousData = await db.getLatest24h();

    if (previousData.length < 1) return false;
    if (previousData.length > 0) {
        for (let i = 0; i < previousData.length; i++){
            let date = new Date(previousData[i].startTime)
            if(date.valueOf() == tomorrow.valueOf()) return true;
        }
    }
    return false;
}

module.exports={isTodaysDataSaved};