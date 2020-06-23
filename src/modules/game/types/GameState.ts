import { Board } from "../actions/board";

export interface GameState {
    player1key: string;
    player2key: string;
    board: Board;
}
