import { Card } from "./Card";

export interface Player {
    cards: Card[];
    gold: number;
    health: number;
}
