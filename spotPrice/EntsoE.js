const xml2js = require('xml2js');

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
     */
    async fetchData(startTime, endTime){

        if (!(startTime instanceof Date) || !(endTime instanceof Date)) throw new Error('Given time parameter not Date object.');

        const response = await fetch('https://web-api.tp.entsoe.eu/api?documentType=A44&in_Domain=10YFI-1--------U'
                + `&out_Domain=10YFI-1--------U&periodStart=${startTime}`
                + `&periodEnd=${endTime}&securityToken=${this.#token}`);

        const stringRes = await response.text();
        let dataObject;
        xml2js.parseString(stringRes, (err, res) => {
            if (err) console.log(err);
            dataObject = res;
        });

        return dataObject;

    }

    /**
     * 
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
}

module.exports = {EntsoE};