import WebSocket from "ws";

export const websocketHandler = (str: string) => JSON.parse(str);

export const sendSocket = (category: string, data: unknown) =>
    JSON.stringify({ category, data });

export const sendAllSockets = (
    wss: WebSocket.Server,
    category: string,
    data: unknown
) => {
    const stringified = sendSocket(category, data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(stringified);
        }
    });
};
