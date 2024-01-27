let instance;

class SpotPrice{

    #timeOfSpotPriceUdpate

    /**
     * 
     * @param {Array<number>} timeOfSpotPriceUpdate give time as an array of two integers [hours, minutes] example [13,45] is 13:45.
     */
    constructor(timeOfSpotPriceUpdate){
        if(instance) throw new Error('Only one SpotPrice instance can be created');
        this.#validateTimeFormat(timeOfSpotPriceUpdate);
        console.log(timeOfSpotPriceUpdate);
        this.#timeOfSpotPriceUdpate=timeOfSpotPriceUpdate;
        instance = this;
    }

    startService(){
        this.#checkIsTimeTodayAfer();
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

        return null;
    }

}

module.exports={SpotPrice};