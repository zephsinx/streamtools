const hourInput = document.getElementById('hour') as HTMLInputElement;
const minuteInput = document.getElementById('minute') as HTMLInputElement;
const secondInput = document.getElementById('second') as HTMLInputElement;

const setBtn = document.getElementById('setBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

const socket = new WebSocket('ws://localhost:8000');

setBtn.addEventListener('click', () => {
    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);
    const second = parseInt(secondInput.value);

    socket.send(JSON.stringify({
        type: 'set',
        value: hour * 3600 + minute * 60 + second
    }));
});

startBtn.addEventListener('click', () => {
    socket.send(JSON.stringify({
        type: 'start'
    }));
});

stopBtn.addEventListener('click', () => {
    socket.send(JSON.stringify({
        type: 'stop'
    }));
});

resetBtn.addEventListener('click', () => {
    socket.send(JSON.stringify({
        type: 'reset'
    }));
});
