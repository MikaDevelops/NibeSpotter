const {Db} = require('./../dataBase/Db');
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

    #spotPriceUpdateTimer(countdownMilliseconds){
        setTimeout(()=>{
            this.startService();
        }, countdownMilliseconds);
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
                        this.#spotData.tomorrow = dataArray;  
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
                this.#spotData.tomorrow = dataArray;
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

        if(this.#spotData.today === undefined){
            let today = new Date();
            today.setHours(1,0,0,0);
            let startTime = this.#epochSeconds(today);
            today.setTime(today.valueOf() + 82800000)
            let endTime = this.#epochSeconds(today);

            const todayData = this.#dataBaseObject.getSpotData([startTime, endTime]);
            if (todayData.length < 23) throw new Error ('Today spot data incomplete. ' + new Date().setTime(startTime).toISOString());
            this.#spotData.today = todayData;

            if (todayData === 0){
                
            }
        }
        
    }

    async #fetchDataFromNordPool(){
        let response = await fetch('https://www.nordpoolgroup.com/api/marketdata/page/35?currency=EUR');
        let spotData = await response.json();
        return spotData;
    }

    #epochSeconds(dateTime){
        return Math.floor(dateTime.valueOf()/1000);
    }

}

module.exports={SpotPrice};