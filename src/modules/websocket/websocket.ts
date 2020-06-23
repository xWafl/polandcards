import {
    sendAllSockets,
    sendSocket,
    websocketHandler
} from "./helpers/handler";
import { WSData } from "./helpers/WSData";
import { games } from "../game/games";
import { Board } from "../game/actions/board";
import WebSocket from "ws";
import { genGameKey } from "../game/actions/auth";

const websocketRoutes = (
    wss: WebSocket.Server,
    ws: WebSocket,
    message: WSData
): void => {
    const { category, data } = websocketHandler(message.toString());
    if (category === "newgame") {
        const newMaxId =
            Object.keys(games).length === 0
                ? 0
                : Math.max(...Object.keys(games).map(Number)) + 1;
        games[newMaxId] = {
            player1key: genGameKey(),
            player2key: genGameKey(),
            board: new Board()
        };
        games[newMaxId].board.startGame();
        return;
    }
    if (category === "joinGame") {
        const { key, id } = data;
        if (games[id].player1key === key) {
            ws.send(sendSocket("playerData", games[id].board.player1));
        } else if (games[id].player2key === key) {
            ws.send(sendSocket("playerData", games[id].board.player1));
        }
        ws.send(sendSocket("gameData", games[id].board.gameData));
        ws.send(sendSocket("gameLoaded", ""));
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

export { websocketRoutes };
