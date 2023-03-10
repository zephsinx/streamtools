"use strict";

import * as WebSocket from "ws";
import express from "express";

const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const MAX_WS_CLIENTS = process.env.MAX_WS_CLIENTS || 100;

app.use('/js', express.static(path.join(__dirname, '/src/js')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timer.html'))
});

app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timerConfig.html'))
});

const wss = new WebSocket.Server({ port: 8000 });
let timerValue = 120;
let connectionCount = 0;

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    if (connectionCount >= MAX_WS_CLIENTS) {
        ws.send("Max connections reached. Connection refused.");
        rejectConnection(ws);
    } else {
        connectionCount++;
    }

    ws.onmessage = (event) => {
        let data;
        if (typeof event.data === "string") {
            data = JSON.parse(event.data);
        }
        handleMessage(ws, data);
    }

    ws.on("close", () => {
        connectionCount--;
        console.log("Client disconnected");
    });
});

function rejectConnection(ws: WebSocket) {
    // TODO: Figure out a better way to handle connection counts
    // Increase connectionCount since ws.close() reduces the connection count, and a rejection should be a
    // zero-sum action
    connectionCount++;
    ws.close();
}

// Handle messages received from WebSocket client
// @ts-ignore
function handleMessage(ws: WebSocket, message) {
    switch (message.type) {
        case "getInitialTimerValue":
            ws.send(
                JSON .stringify({
                    type: "initialTimerValue",
                    value: timerValue,
                })
            );
            break;
        case "set":
            timerValue = message.value;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            type: "set",
                            value: timerValue,
                        })
                    );
                }
            });
            break;
        case "stop":
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "stop" }));
                }
            });
            break;
        case "start":
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "start" }));
                }
            });
            break;
        case "reset":
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "reset" }));
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