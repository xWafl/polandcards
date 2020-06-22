export interface Card {
    id: number;
    name: string;
    attack: number;
    health: number;
    gold: number;
}

export type BoardCard = Card & { attackable: boolean };
