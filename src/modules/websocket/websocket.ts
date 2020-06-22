import { sendSocket, websocketHandler } from "./helpers/handler";
import { WSData } from "./helpers/WSData";
import { games } from "../game/games";
import { Board } from "../game/actions/board";
import WebSocket from "ws";

const websocketRoutes = (wss: WebSocket.Server, ws: WebSocket, message: WSData): void => {
    const { category, data } = websocketHandler(message.toString());
    if (category === "newgame") {
        const newMaxId =
            Object.keys(games).length === 0
                ? 0
                : Math.max(...Object.keys(games).map(Number)) + 1;
        games[newMaxId] = new Board();
        games[newMaxId].startGame();
        ws.send(sendSocket("gameData", games[newMaxId].gameData));
        ws.send(sendSocket("playerData", games[newMaxId].player1));
        return;
    }
    const gameId = data.id;
    if (category === "playCard") {
        games[gameId].playCard(data.cardId, data.slot);
    } else if (category === "attackCard") {
        games[gameId].attack(data.cardId, data.receiverId);
    }
    const publicState = games[gameId].gameData;
    const playerData = games[gameId].player1;
    ws.send(sendSocket("gameData", publicState));
    ws.send(sendSocket("playerData", playerData));
};

export { websocketRoutes };
