const {Db} = require('./../dataBase/Db');
const { getMonthWithLeadZero, getLastSunday } = require('./DateTimeFunctions');
const {extractData} = require('./ExtractData');
let instance;

class SpotPrice{

    #timeOfSpotPriceUdpate;
    #firstRun = true;
    #threshold = 5000;
    #dataBaseObject;
    #spotData = {
        today: undefined,
        tomorrow: undefined
    };

    /**
     * 
     * @param {Array<number>} timeOfSpotPriceUpdate give time as an array of two integers [hours, minutes] example [13,45] is 13:45.
     * @param {Db} dataBaseObject
     */
    constructor(timeOfSpotPriceUpdate, dataBaseObject){
        if(instance) throw new Error('Only one SpotPrice instance can be created');
        this.#validateTimeFormat(timeOfSpotPriceUpdate);
        this.#timeOfSpotPriceUdpate=timeOfSpotPriceUpdate;
        this.#dataBaseObject = dataBaseObject;
        instance = this;
    }

    async startService(){

        this.#updateTomorrowsData();

    }

    #validateTimeFormat(time){
        if (time.length > 2 || time.length < 2) throw new Error('Not exactly 2 parameters given.');
        if (!Number.isInteger(time[0]) || !Number.isInteger(time[1])) throw new Error('Not number parameter given.');
        if (time[0] < 0 || time[1] < 0) throw new Error('Negative number given.');
        if (time[0] > 23) throw new Error('Hour cannot be over 23.');
        if (time[1] > 59) throw new Error('Minutes cannot be over 59.');
    }

    #checkIsTimeTodayAfer(){
        let today = new Date();
        let checkTime = this.#makeDateWithTimeOfSpotPriceUpdate();
        checkTime.setTime(checkTime.valueOf()+this.#threshold)
        if (today.valueOf() >= checkTime.valueOf()) return true;
        else return false;
    }

    #makeDateWithTimeOfSpotPriceUpdate(){
        let utcDate = new Date();
        utcDate.setUTCHours(this.#timeOfSpotPriceUdpate[0], this.#timeOfSpotPriceUdpate[1], 0, 0);
        return utcDate;
    }

    // TODO: to private method
    countTimeDifferenceToUpdate(time){

        let spotUpdateTime = this.#makeDateWithTimeOfSpotPriceUpdate();
        let timeDiff = spotUpdateTime.valueOf() - time.valueOf();
        
        if(timeDiff<0){
            if(timeDiff > -this.#threshold){
                timeDiff = 10000;
            }
            else {
                spotUpdateTime.setTime(spotUpdateTime.valueOf() + 86400000);
                timeDiff = spotUpdateTime.valueOf() - time.valueOf();
            }
        }

        return timeDiff;
    }

    async #updateTomorrowsData(){

        if (this.#checkIsTimeTodayAfer()){
            if(this.#firstRun){
                try{
                    let tomorrow = new Date();
                    tomorrow.setHours(0,0,0,0);
                    tomorrow.setTime(tomorrow.valueOf()+90000000);
                    let firstValue = this.#epochSeconds(tomorrow);
                    tomorrow.setHours(23,0,0,0);
                    tomorrow.setTime(tomorrow.valueOf()+3600000);
                    let lastValue = this.#epochSeconds(tomorrow);

                    const data = await this.#dataBaseObject.getSpotData([firstValue,lastValue]);

                    if(data.length > 22 && data.length < 26){
                        this.#spotData.tomorrow = data;
                    }
                    else if(data.length > 0 && data.length < 23 || data.length > 25) {
                        throw new Error(
                        'spot data probably corrupted, check data for ' + tomorrow.toISOString());
                    }
                    if (data.length === 0) {
                        let spotData = await this.#fetchDataFromNordPool();
                        const dataArray = extractData(spotData);
                        if(dataArray.length === 0) throw new Error ('Empty tomorrow dataset from Nordpool.');
                        this.#dataBaseObject.saveSpotData(dataArray);
                        this.#spotData.tomorrow = [...dataArray]; 
                    }    

                }catch(error){
                    console.log(error);
                }   
            }
            else {
                let spotData = await this.#fetchDataFromNordPool();
                const dataArray = extractData(spotData);
                if(dataArray.length === 0) throw new Error ('Empty tomorrow dataset from Nordpool.');
                this.#dataBaseObject.saveSpotData(dataArray);
                this.#spotData.tomorrow = [...dataArray];
            }

            setTimeout(()=>{
                this.#updateTomorrowsData();
            }, this.countTimeDifferenceToUpdate(new Date())); 

        }
        else {

            setTimeout(()=>{
                this.#updateTomorrowsData();
            }, this.countTimeDifferenceToUpdate(new Date()));
                
        }

        if(this.#firstRun) {
            this.#firstRun = false;
            this.#updateTodaysData();
        }
    }

    //TODO
    async #updateTodaysData(){

        let today = new Date();
        today.setHours(1,0,0,0);
        const startTimeMilliseconds = today.valueOf();
        const startTime = this.#epochSeconds(today);
        today.setTime(today.valueOf() + 82800000)
        const endTime = this.#epochSeconds(today);

        if(this.#spotData.today === undefined){
            
            const todayData = await this.#dataBaseObject.getSpotData([startTime, endTime]);
            if (todayData.length < 23) console.log ('Today spot data incomplete.');
            this.#spotData.today = todayData; 

            if (todayData.length === 0){

                const dataFromNordPool = await this.#fetchDataFromNordPool();
                // TODO: spotDataColumnByDate to find today data

            }

        }
        else{

            if (startTime !== this.#spotData.tomorrow[0]) { 
                console.log ('Today data not found in tomorrow data.');
            }

            this.#spotData.today = [...this.#spotData.tomorrow];
            this.#spotData.tomorrow = undefined;

        }

        // 24h + 1 minute (86400000 + 60000)
        const timeDiff = (startTimeMilliseconds + 86460000) - new Date().valueOf();
        setTimeout(()=>{
            this.#updateTodaysData();
        }, timeDiff);

    }

    async #fetchDataFromNordPool(){
        let response = await fetch('https://www.nordpoolgroup.com/api/marketdata/page/35?currency=EUR');
        let spotData = await response.json();
        return spotData;
    }

    #spotDataColumnByDate(day, data){
        if (!(day instanceof Date)) throw new Error ('Given parameter not a Date object');
        const nameString = day.getDate() +'-'+ getMonthWithLeadZero(day) +'-'+ day.getFullYear();
        const columnIndex = data.data.Rows[0].Columns.findIndex((element) => element.Name == nameString);
        if(columnIndex > -1){
            const daylightSaving = new Date(day).setUTCHours(0,0,0,0) === getLastSunday(day.getFullYear(), 10).setUTCHours(0,0,0,0);
            let daylightCounter = 0;
            const resultArray = [];
            const colIndex = data.data.Rows[0].Columns[columnIndex].Index;
            for (let r=0; r < data.data.Rows.length; r++){

                let columnObject;

                if (data.data.Rows[r].Name.search(/^\d\d/) > -1){
                    columnObject = data.data.Rows[r].Columns.find(element => element.Name == nameString
                        && element.Index == colIndex);
                }
                
                if (columnObject) {

                    
                    let start = data.data.Rows[r].StartTime.split('T')[1].split(':');
                    let end = data.data.Rows[r].EndTime.split('T')[1].split(':');
                    if(daylightSaving && start[0] == 2) daylightCounter++; 

                    let timeDiff = (end[0]-start[0] < 0 ? 24+(end[0]-start[0]) : end[0]-start[0])*3600000 + (end[1]-start[1])*60000 + (end[2]-start[2])*1000;

                    let todayStart = new Date(
                        day.getFullYear(), day.getMonth(), day.getDate(),
                        parseInt(start[0])+1, parseInt(start[1]), parseInt(start[2])
                        );

                    if (daylightCounter == 2) {
                        todayStart.setUTCHours(1);
                        daylightCounter = 3;
                    }

                    let todayEnd = new Date(todayStart.valueOf()+timeDiff);

                    let object = {
                        startTime: todayStart,
                        endTime: todayEnd,
                        price: parseFloat(columnObject.Value.replace(',', '.')),
                        priceArea: 'FI'
                    }
                    if (isNaN(object.price)) continue;
                    resultArray.push(object);
                }
            }
            return resultArray;
        }
        return [];
    }

    #epochSeconds(dateTime){
        return Math.floor(dateTime.valueOf()/1000);
    }

    #spotDataArrayToObjArray(dataArray){
        const objectArray = [];
        for (let i = 0; i < dataArray.length; i+=3){
            let object = {
                startTime:  dataArray[i],
                endTime:    dataArray[i+1],
                price:      dataArray[i+2],
                priceArea:  'FI'
            }
            objectArray.push(object);
        }
        return objectArray;
    }

}

module.exports={SpotPrice};