"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const express_1 = __importDefault(require("express"));
const path = require('path');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MAX_WS_CLIENTS = process.env.MAX_WS_CLIENTS || 100;
app.use('/js', express_1.default.static(path.join(__dirname, '/src/js')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timer.html'));
});
app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/timerConfig.html'));
});
const wss = new WebSocket.Server({ port: 8000 });
let timerValue = 120;
let connectionCount = 0;
wss.on("connection", (ws) => {
    console.log("Client connected");
    if (connectionCount >= MAX_WS_CLIENTS) {
        ws.send("Max connections reached. Connection refused.");
        rejectConnection(ws);
    }
    else {
        connectionCount++;
    }
    ws.onmessage = (event) => {
        let data;
        if (typeof event.data === "string") {
            data = JSON.parse(event.data);
        }
        handleMessage(ws, data);
    };
    ws.on("close", () => {
        connectionCount--;
        console.log("Client disconnected");
    });
});
function rejectConnection(ws) {
    // TODO: Figure out a better way to handle connection counts
    // Increase connectionCount since ws.close() reduces the connection count, and a rejection should be a
    // zero-sum action
    connectionCount++;
    ws.close();
}
// Handle messages received from WebSocket client
// @ts-ignore
function handleMessage(ws, message) {
    switch (message.type) {
        case "getInitialTimerValue":
            ws.send(JSON.stringify({
                type: "initialTimerValue",
                value: timerValue,
            }));
            break;
        case "set":
            timerValue = message.value;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "set",
                        value: timerValue,
                    }));
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
