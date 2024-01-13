/**
 * Checks if time now is after the given time. Check is done with exact hour.
 * Example: 15 -> is time after 15:00:00 this day.
 * @param {Number} time integer hour of day to be checked against.
 * @returns {boolean} true if time now is passed given hour.
 */
function isClockAfter (time) {

    // Make a millisecond value with the given hour
    const checkTime = new Date().setHours(time, 0, 0, 0);
    if (Date.now() > checkTime) return true;
    else return false;
}

module.exports = {isClockAfter}