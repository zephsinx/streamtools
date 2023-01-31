module.exports = class TimerData {
    maxConnectionCount;
    timerValue;
    startTime;
    timerRunning;

    constructor(timerValue, timerRunning, startTime, maxConnectionCount) {
        this.timerValue = timerValue;
        this.timerRunning = timerRunning;
        this.startTime = startTime;
        this.maxConnectionCount = maxConnectionCount;
    }
}