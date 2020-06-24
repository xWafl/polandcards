import {
    sendAllSockets,
    sendSocket,
    websocketHandler
} from "./helpers/handler";
import { WSData } from "./helpers/WSData";
import { games } from "../game/games";
import { Board } from "../game/actions/board";
import WebSocket from "ws";
import { queue } from "../game/queue";

export const websocketRoutes = (
    wss: WebSocket.Server,
    ws: WebSocket,
    message: WSData
): void => {
    const { category, data } = websocketHandler(message.toString());
    if (category === "ping") {
        return;
    }
    if (category === "awaitMatch") {
        const id = data;
        const currQueueling = queue.find(l => l.id === id);
        if (currQueueling) {
            currQueueling.ws = ws;
            if (queue.length >= 2) {
                const newMaxId =
                    Object.keys(games).length === 0
                        ? 0
                        : Math.max(...Object.keys(games).map(Number)) + 1;
                games[newMaxId] = {
                    player1key: "p1",
                    player2key: "p2",
                    board: new Board()
                };
                games[newMaxId].board.startGame();
                const newGame = games[newMaxId];
                const user1 = queue.shift();
                const user2 = queue.shift();
                user1!.ws!.send(sendSocket("gameStarted", newGame.player1key));
                user2!.ws!.send(sendSocket("gameStarted", newGame.player2key));
            }
        }
        return;
    }
    if (category === "newgame") {
        const newMaxId =
            Object.keys(games).length === 0
                ? 0
                : Math.max(...Object.keys(games).map(Number)) + 1;
        games[newMaxId].board = new Board();
        games[newMaxId].board.startGame();
        ws.send(sendSocket("gameData", games[newMaxId].board.gameData));
        ws.send(sendSocket("playerData", games[newMaxId].board.player1));
        ws.send(sendSocket("gameLoaded", ""));
        return;
    }
    if (category === "spectateGame") {
        const { id } = data;
        ws.send(sendSocket("gameData", games[id].board.gameData));
        return;
    }
    const gameId = data.id;
    if (category === "playCard") {
        games[gameId].board.playCard(data.cardId, data.slot);
    } else if (category === "attackCard") {
        games[gameId].board.attack(data.cardId, data.receiverId);
    }
    const publicState = games[gameId].board.gameData;
    const playerData = games[gameId].board.player1;
    sendAllSockets(wss, "gameData", publicState);
    sendAllSockets(wss, "playerData", playerData);
};
