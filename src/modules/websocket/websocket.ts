import { sendSocket, websocketHandler } from "./helpers/handler";
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
                const user1 = queue.shift();
                const user2 = queue.shift();
                const newMaxId =
                    Object.keys(games).length === 0
                        ? 0
                        : Math.max(...Object.keys(games).map(Number)) + 1;
                games[newMaxId] = {
                    player1: {
                        id: user1!.id,
                        key: "p1",
                        ws: null
                    },
                    player2: {
                        id: user2!.id,
                        key: "p2",
                        ws: null
                    },
                    board: new Board()
                };
                games[newMaxId].board.startGame();
                const newGame = games[newMaxId];
                user1!.ws!.send(
                    sendSocket("gameStarted", {
                        key: newGame.player1.key,
                        id: newMaxId,
                        flipped: false
                    })
                );
                user2!.ws!.send(
                    sendSocket("gameStarted", {
                        key: newGame.player2.key,
                        id: newMaxId,
                        flipped: true
                    })
                );
            }
        }
        return;
    }
    if (category === "joinGame") {
        const { gameId, key } = data;
        if (games[gameId]) {
            ws.send(sendSocket("gameData", games[gameId].board.gameData));
            if (games[gameId].player1.key === key) {
                games[gameId].player1.ws = ws;
                ws.send(sendSocket("playerData", games[gameId].board.player1));
            } else if (games[gameId].player2.key === key) {
                games[gameId].player2.ws = ws;
                ws.send(sendSocket("playerData", games[gameId].board.player2));
            }
            ws.send(sendSocket("gameLoaded", ""));
        }
        return;
    }
    // Everything from here on out requires a key
    const { gameId, key } = data;
    const game = games[gameId];
    if (!game) return;
    if (!game.player1.key === key && !game.player2.key === key) return;
    const currPlayer = game.player1.key === key ? game.player1 : game.player2;
    if (ws !== currPlayer.ws) currPlayer.ws = ws;
    if (category === "endTurn") {
        game.board.endTurn();
        return;
    }
    if (category === "playCard") {
        games[gameId].board.playCard(data.cardId, data.slot);
    } else if (category === "attackCard") {
        games[gameId].board.attack(data.cardId, data.receiverId);
    }
    const publicState = games[gameId].board.gameData;
    const player1Data = games[gameId].board.player1;
    const player2Data = games[gameId].board.player2;
    if (games[gameId].player1.ws) {
        games[gameId].player1.ws!.send(sendSocket("gameData", publicState));
        games[gameId].player1.ws!.send(sendSocket("playerData", player1Data));
    }
    if (games[gameId].player2.ws) {
        games[gameId].player2.ws!.send(sendSocket("gameData", publicState));
        games[gameId].player2.ws!.send(sendSocket("playerData", player2Data));
    }
};
