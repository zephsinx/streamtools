let currentTimerValue;
let timerValue;
let intervalId = 0;

const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const secondInput = document.getElementById('second');

const setBtn = document.getElementById('setBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const configWebSocket = new WebSocket('ws://localhost:8000');

// Update timerValue with new value received from server
configWebSocket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case "initialTimerValue":
            timerValue = message.value;
            currentTimerValue = message.running ? message.remaining : timerValue;
            setOnScreenTimers(currentTimerValue);
            if (message.running) {
                intervalId = Number(setInterval(countdown, 1000));
            }
            break;
        case "set":
            clearInterval(intervalId);
            intervalId = 0;
            timerValue = message.value;
            currentTimerValue = timerValue;
            document.getElementById("timer").innerHTML = formatTimer(currentTimerValue);
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
            currentTimerValue = timerValue;
            setOnScreenTimers(currentTimerValue);
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = Number(setInterval(countdown, 1000));
            }
            break;
    }
};

setBtn.addEventListener('click', () => {
    const hour = parseInt(hourInput.value || "0");
    const minute = parseInt(minuteInput.value || "0");
    const second = parseInt(secondInput.value || "0");

    configWebSocket.send(JSON.stringify({
        type: 'set',
        value: hour * 3600 + minute * 60 + second
    }));
});

startBtn.addEventListener('click', () => {
    configWebSocket.send(JSON.stringify({
        type: 'start'
    }));
});

stopBtn.addEventListener('click', () => {
    configWebSocket.send(JSON.stringify({
        type: 'stop'
    }));
});

resetBtn.addEventListener('click', () => {
    configWebSocket.send(JSON.stringify({
        type: 'reset'
    }));
});

function setOnScreenTimers(timerValue) {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');

    document.getElementById("timer").innerHTML = hours + ":" + minutes + ":" + seconds + " (HH:mm:ss)";
    hourInput.value = hours;
    minuteInput.value = minutes;
    secondInput.value = seconds;
}

// Format timer value as hours, minutes, and seconds
// @ts-ignore
function formatTimer(timerValue) {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds + " (HH:mm:ss)";
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