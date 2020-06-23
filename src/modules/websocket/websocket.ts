import {
    sendAllSockets,
    sendSocket,
    websocketHandler
} from "./helpers/handler";
import { WSData } from "./helpers/WSData";
import { games } from "../game/games";
import { Board } from "../game/actions/board";
import WebSocket from "ws";

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
        games[newMaxId].board = new Board();
        games[newMaxId].board.startGame();
        ws.send(sendSocket("gameData", games[newMaxId].board.gameData));
        ws.send(sendSocket("playerData", games[newMaxId].board.player1));
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

export { websocketRoutes };
