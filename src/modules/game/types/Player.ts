import { BoardCard, Card } from "./Card";

export interface Player {
    cards: BoardCard[];
    gold: number;
    health: number;
    deck: Card[];
    hand: Card[];
}
