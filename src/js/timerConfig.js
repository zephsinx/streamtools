"use strict";
let currentConfigTimerValue;
let configTimerValue;
const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const secondInput = document.getElementById('second');
const setBtn = document.getElementById('setBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const configWebSocket = new WebSocket('ws://localhost:8000');
configWebSocket.onopen = function () {
    const message = { type: 'getInitialTimerValue' };
    configWebSocket.send(JSON.stringify(message));
};
// Update timerValue with new value received from server
configWebSocket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (message.type === "initialTimerValue") {
        configTimerValue = message.value;
        currentConfigTimerValue = configTimerValue;
        document.getElementById("timer").innerHTML = formatTimer(currentConfigTimerValue);
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
// Format timer value as hours, minutes, and seconds
// @ts-ignore
function formatTimer(timerValue) {
    const hours = (Math.floor(timerValue / 3600)).toString().padStart(2, '0');
    const minutes = (Math.floor((timerValue % 3600) / 60)).toString().padStart(2, '0');
    const seconds = (timerValue % 60).toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds + " (HH:mm:ss)";
}
