import { BoardCard, Card } from "../types/Card";
import { Player } from "../types/Player";

export class Board {
    public readonly player1: Player = {
        cards: Array(4) as BoardCard[],
        health: 30,
        gold: 0,
        deck: [],
        hand: [
            <Card>{
                id: 2,
                name: "Poland",
                attack: 3,
                health: 4,
                gold: 3
            }
        ]
    };
    public readonly player2: Player = {
        cards: Array(4) as BoardCard[],
        health: 30,
        gold: 0,
        deck: [],
        hand: [
            <Card>{
                id: 3,
                name: "Poland",
                attack: 3,
                health: 2,
                gold: 3
            }
        ]
    };
    public turnNum = 0;
    public player1Move = true;

    constructor() {}

    public playCard(player: number, cardId: number, slot: number) {
        if (!(player === 0 || player === 1)) {
            return false;
        }
        const playerHand = player === 0 ? this.player1.hand : this.player2.hand;
        const card = playerHand.find(l => l.id === cardId);
        if (!card) {
            return false;
        }
        const arr = player === 0 ? this.player1.cards : this.player2.cards;
        if (arr[slot]) {
            return false;
        }
        arr[slot] = { ...card, attackable: false };
        return true;
    }

    private removeDeadCards() {
        (this.player1.cards
            .map((l, idx) => (l?.health <= 0 ? idx : undefined))
            .filter(l => l !== undefined) as number[]).map(l => {
            delete this.player1.cards[l];
        });
        (this.player2.cards
            .map((l, idx) => (l?.health <= 0 ? idx : undefined))
            .filter(l => l !== undefined) as number[]).map(l => {
            delete this.player2.cards[l];
        });
    }

    public attack(attackerId: number, receiverId: number) {
        const attackerCards = this.player1Move
            ? this.player1.cards
            : this.player2.cards;
        const receiverCards = !this.player1Move
            ? this.player1.cards
            : this.player2.cards;
        const attackerCard = attackerCards.find(l => l?.id === attackerId);
        const receiverCard = receiverCards.find(l => l?.id === receiverId);
        if (!(attackerCard && receiverCard)) {
            return false;
        }
        if (attackerId < 2) {
            return false;
        }
        if (receiverId < 2) {
            return false;
        }
        attackerCard.health -= receiverCard.attack;
        receiverCard.health -= attackerCard.attack;
        this.removeDeadCards();
        return true;
    }

    public endTurn() {
        if (this.player1Move) {
            this.player1Move = false;
        } else {
            this.player1Move = true;
            this.turnNum++;
        }
    }
}
