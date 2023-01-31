"use strict";

import express from "express";
import path from "path";
import url from 'url';
import WebSocket, {WebSocketServer} from 'ws';
import TimerData from './src/js/timerData'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const DEFAULT_TIMER_VALUE = process.env.DEFAULT_TIMER_VALUE || 120;
const MAX_WS_CLIENTS = process.env.MAX_WS_CLIENTS || 100;
const PORT = process.env.PORT || 3000;

app.use('/js', express.static(path.join(__dirname, '/src/js')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timer.html'))
});

app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timerConfig.html'))
});

const wss = new WebSocketServer({port: 8000});

let timerData = new TimerData(DEFAULT_TIMER_VALUE, false, new Date(), MAX_WS_CLIENTS);
let connectionCount = 0;

wss.on("connection", (ws) => {
    console.log("Client connected");
    connectionCount++;

    let now = new Date();
    let secondsSinceStart = Math.floor(Math.abs(now.getTime() - timerData.startTime.getTime()) / 1000);
    let timeRemaining = (secondsSinceStart < timerData.timerValue) ? (timerData.timerValue - secondsSinceStart) : 0;
    ws.send(
        JSON.stringify({
            type: "initialTimerValue",
            value: timerData.timerValue,
            remaining: timeRemaining,
            running: timerData.timerRunning,
        })
    );

    if (connectionCount >= MAX_WS_CLIENTS) {
        ws.close();
    }

    ws.onmessage = (event) => {
        let data;
        data = JSON.parse(event.data);
        handleMessage(ws, data);
    }

    ws.on("close", () => {
        connectionCount--;
        console.log("Client disconnected");
    });
});

// Handle messages received from WebSocket client
function handleMessage(ws, message) {
    switch (message.type) {
        case "getInitialTimerValue":
            ws.send(
                JSON.stringify({
                    type: "initialTimerValue",
                    value: timerData.timerValue,
                    running: timerData.timerRunning,
                })
            );
            break;
        case "set":
            timerData.timerValue = message.value;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            type: "set",
                            value: timerData.timerValue,
                        })
                    );
                }
            });
            break;
        case "stop":
            timerData.timerRunning = false;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: "stop"}));
                }
            });
            break;
        case "start":
            timerData.timerRunning = true;
            // todo: figure out start time stuff
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: "start"}));
                }
            });
            break;
        case "reset":
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: "reset"}));
                }
            });
            break;
    }
}

console.log("WebSocket Server started on port 8000...");

// Server setup
app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
});