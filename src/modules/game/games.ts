import { GameState } from "./types/GameState";

export const games: Record<number, GameState> = {};

export const gameStatePublic = (state: GameState) => ({
    player1: state.player1.id,
    player2: state.player2.id,
    board: state.board.gameData
});
