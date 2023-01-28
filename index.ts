import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000, maxConnections: 100 });
let initialTimerValue = 120;

wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        switch (data.type) {
            case "getInitialTimerValue":
                ws.send(
                    JSON.stringify({
                        type: "initialTimerValue",
                        value: initialTimerValue
                    })
                );
                break;
            case "set":
                initialTimerValue = data.value;
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: "set",
                                value: initialTimerValue
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
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

console.log("Server started on port 8000");
