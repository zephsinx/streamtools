let currentTimerValue;
let timerValue;
let intervalId;

// Connect to WebSocket server
const webSocket = new WebSocket("ws://example.com:8000");

// Retrieve initial timer value from server on page load
webSocket.onopen = function () {
    webSocket.send("getInitialTimerValue");
};

// Update timerValue with new value received from server
webSocket.onmessage = function (event: MessageEvent) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "initialTimerValue":
            
            break;
        case "set":
            clearInterval(intervalId);
            timerValue = message.value;
            currentTimerValue = timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
            break;
        case "stop":
            clearInterval(intervalId);
            break;
        case "start":
            intervalId = setInterval(countdown, 1000);
            break;
        case "reset":
            clearInterval(intervalId);
            currentTimerValue = timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
            intervalId = setInterval(countdown, 1000);
            break;
    }
};

// Format timer value as hours, minutes, and seconds
function formatTimer(timerValue: number): string {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds + " (HH:mm:ss)";
}

function countdown(){
    if (currentTimerValue <= 0) {
        clearInterval(intervalId);
        document.getElementById("timer").innerHTML = "Times up!";
        return;
    }
    currentTimerValue--;
    document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
}

