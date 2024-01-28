let instance;

class SpotPrice{

    #timeOfSpotPriceUdpate;
    #firstRun = true;
    #threshold = 5000;

    /**
     * 
     * @param {Array<number>} timeOfSpotPriceUpdate give time as an array of two integers [hours, minutes] example [13,45] is 13:45.
     */
    constructor(timeOfSpotPriceUpdate){
        if(instance) throw new Error('Only one SpotPrice instance can be created');
        this.#validateTimeFormat(timeOfSpotPriceUpdate);
        this.#timeOfSpotPriceUdpate=timeOfSpotPriceUpdate;
        instance = this;
    }

    startService(){
        if (this.#checkIsTimeTodayAfer()){

        }
        else {
            // start timer 
            this.#spotPriceUpdateTimer(
                this.countTimeDifferenceToUpdate(new Date())
            );

            // start today data fetching
            if(this.#firstRun) this.#updateTodaysData();

            this.#firstRun = false;
        }

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

    //TODO
    #updateTodaysData(){}

}

module.exports={SpotPrice};