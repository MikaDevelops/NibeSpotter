const xml2js = require('xml2js');
const {getTomorrow, isSummertime} = require('./DateTimeFunctions');

class EntsoE{
    #token;

    /**
     * 
     * @param {string} token 
     */
    constructor(token){
        this.#token = token;
    }

    /**
     * Loads price data from Entso-E API
     * @param {Date} startTime 
     * @param {Date} endTime 
     * @returns {Object[]} array of objects.
     */
    async fetchData(startTime, endTime){

        if (!(startTime instanceof Date) || !(endTime instanceof Date)) throw new Error('Given time parameter not Date object.');

        const startString   = this.makePeriodString(startTime);
        const endString     = this.makePeriodString(endTime);

        try {
            const response = await fetch('https://web-api.tp.entsoe.eu/api?documentType=A44&in_Domain=10YFI-1--------U'
                    + `&out_Domain=10YFI-1--------U&periodStart=${startString}`
                    + `&periodEnd=${endString}&securityToken=${this.#token}`);


            const stringRes = await response.text();
            let dataObject;
            xml2js.parseString(stringRes, (err, res) => {
                if (err) console.log(err);
                dataObject = res;
            });

            return dataObject;

        } catch (error){
            console.error(error.message);
        }

    }

    /**
     * Makes string using Date-object.
     * @param {Date} datetime 
     * @returns {string} 'YYYYmmddhhmm'
     */
    makePeriodString(datetime) {
        let day = datetime.getDate()<10     ? '0'+datetime.getDate().toString()     : datetime.getDate().toString();
        let month = datetime.getMonth()<9   ? '0'+(datetime.getMonth()+1).toString(): (datetime.getMonth()+1).toString();
        let hour = datetime.getHours()<10   ? '0'+datetime.getHours().toString()    : datetime.getHours().toString();
        let minute = datetime.getMinutes()<10 ? '0'+datetime.getMinutes().toString(): datetime.getMinutes().toString();

        let dateTimeString = 
              datetime.getFullYear().toString()
              + month
              + day
              + hour
              + minute;

        return dateTimeString;
    }

    extractPriceData(dataObject){
        const resultArray = [];
        const timeSeries = dataObject.Publication_MarketDocument.TimeSeries;
        
        for (let i = 0; i < timeSeries.length; i++){
            let period = timeSeries[i].Period[0];
            let resolution = period.resolution[0];
            let dataStartTime = Math.floor(new Date (period.timeInterval[0].start[0]).getTime()/1000);
            
            for (let pointIndex = 0; pointIndex < period.Point.length; pointIndex++){
                let positionToStart = (parseInt(period.Point[pointIndex].position[0])-1)*this.#timeIntervalSeconds(resolution);
                let pointStartTime = dataStartTime + positionToStart;
                let pointEndTime = pointStartTime + this.#timeIntervalSeconds(resolution);
                let priceData = parseFloat(period.Point[pointIndex]['price.amount'][0]);
                resultArray.push({
                    startTime: pointStartTime,
                    endTime: pointEndTime,
                    price: priceData,
                    priceArea: 'FI'
                });
            }
        }

        return resultArray;
    }

    /**
     * Returns time interval in seconds.
     * @param {string} intervalCode ISO8601 PT code
     * @returns {Number} seconds
     */
    #timeIntervalSeconds(intervalCode){
        let seconds;
        switch(intervalCode){
            case 'PT60M':
                seconds=3600;
                break;
            case 'PT30M':
                seconds=1800;
                break;
            case 'PT15M':
                seconds=900;
                break;
            default:
                throw new Error('Time interval code not supported.');
        }
        return seconds;
    }
}

module.exports = {EntsoE};