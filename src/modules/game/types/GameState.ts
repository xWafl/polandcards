import { Board } from "../actions/board";
import WebSocket from "ws";

interface PlayerState {
    id: number;
    key: string;
    ws: WebSocket;
}

export interface GameState {
    player1: PlayerState;
    player2: PlayerState;
    board: Board;
}
