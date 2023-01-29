

let currentClientTimerValue: number;
let clientTimerValue: number;
let intervalId = 0;

// Connect to WebSocket server
const webSocketClient = new WebSocket("ws://localhost:8000");

// Retrieve initial timer value from server on page load
webSocketClient.onopen = function () {
    const message = { type: 'getInitialTimerValue' };
    webSocketClient.send(JSON.stringify(message));
};

// Update timerValue with new value received from server
webSocketClient.onmessage = function (event: MessageEvent) {
    const message = JSON.parse(event.data);
    const endDate = new Date(message.value);

    endDate;


    switch (message.type) {
        case "initialTimerValue":
            clientTimerValue = message.value;
            currentClientTimerValue = clientTimerValue;
            document.getElementById("timer")!.innerHTML = formatTimer(currentClientTimerValue);
            break;
        case "set":
            clearInterval(intervalId);
            intervalId = 0;
            clientTimerValue = message.value;
            currentClientTimerValue = clientTimerValue;
            document.getElementById("timer")!.innerHTML = formatTimer(currentClientTimerValue);
            break;
        case "stop":
            clearInterval(intervalId);
            intervalId = 0;
            break;
        case "start":
            if (intervalId <= 0)
                intervalId = Number(setInterval(countdown, 1000));
            break;
        case "reset":
            clearInterval(intervalId);
            currentClientTimerValue = clientTimerValue;
            document.getElementById("timer")!.innerHTML = formatTimer(currentClientTimerValue);
            intervalId = Number(setInterval(countdown, 1000));
            break;
    }
};

// Format timer value as hours, minutes, and seconds
// @ts-ignore
function formatTimer(timerValue: number): string {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds + " (HH:mm:ss)";
}

function countdown(){
    if (currentClientTimerValue <= 0) {
        clearInterval(intervalId);
        intervalId = 0;
        document.getElementById("timer")!.innerHTML = "Times up!";
        return;
    }
    currentClientTimerValue--;
    document.getElementById("timer")!.innerHTML = formatTimer(currentClientTimerValue);
}

