let currentTimerValue;
let timerValue;
let intervalId = 0;

// Connect to WebSocket server
const webSocketClient = new WebSocket("ws://localhost:8000");

// Update timerValue with new value received from server
webSocketClient.onmessage = function (event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "initialTimerValue":
            timerValue = message.value;
            currentTimerValue = message.running ? message.remaining : timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
            if (message.running) {
                intervalId = Number(setInterval(countdown, 1000));
            }
            break;
        case "start":
            if (intervalId <= 0)
                intervalId = Number(setInterval(countdown, 1000));
            break;
        case "stop":
            clearInterval(intervalId);
            intervalId = 0;
            break;
        case "set":
            clearInterval(intervalId);
            intervalId = 0;
            timerValue = message.value;
            currentTimerValue = timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
            break;
        case "reset":
            currentTimerValue = timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
            if (intervalId > 0) {
                clearInterval(intervalId);
                intervalId = Number(setInterval(countdown, 1000));
            }
            break;
    }
};

// Format timer value as hours, minutes, and seconds
// @ts-ignore
function formatTimer(timerValue) {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds;
}

function countdown() {
    if (currentTimerValue <= 0) {
        document.getElementById("timer").innerHTML = "Times up!";
        clearInterval(intervalId);
        intervalId = 0;
        return;
    }
    currentTimerValue--;
    document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
}

