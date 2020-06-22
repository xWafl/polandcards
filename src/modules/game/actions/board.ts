import { Card } from "../types/Card";

export class Board {
    public readonly player1: Card[] = Array(4);
    public readonly player2: Card[] = Array(4);
    public player1health = 30;
    public player2health = 30;
    public turnNum = 0;
    public player1Move = true;

    constructor() {}

    public playCard(player: number, card: Card, slot: number) {
        if (!(player === 0 || player === 1)) {
            return false;
        }
        const arr = player === 0 ? this.player1 : this.player2;
        if (arr[slot]) {
            return false;
        }
        arr[slot] = card;
        return true;
    }

    private removeDeadCards() {
        (this.player1
            .map((l, idx) => (l?.health <= 0 ? idx : undefined))
            .filter(l => l !== undefined) as number[]).map(l => {
            delete this.player1[l];
        });
        (this.player2
            .map((l, idx) => (l?.health <= 0 ? idx : undefined))
            .filter(l => l !== undefined) as number[]).map(l => {
            delete this.player2[l];
        });
    }

    public attack(attackerId: number, receiverId: number) {
        const attackerCards = this.player1Move ? this.player1 : this.player2;
        const receiverCards = !this.player1Move ? this.player1 : this.player2;
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
