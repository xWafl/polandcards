import { BoardCard, Card } from "../types/Card";
import { Player } from "../types/Player";
import { GameResponse } from "../error/gameResponse";

export class Board {
    public readonly player1: Player = {
        cards: [] as BoardCard[],
        health: 30,
        gold: 0,
        deck: [
            <Card>{
                id: 2,
                name: "Poland",
                attack: 3,
                health: 4,
                gold: 3
            },
            <Card>{
                id: 4,
                name: "Niederlande",
                attack: 2,
                health: 5,
                gold: 3
            }
        ],
        hand: []
    };
    public readonly player2: Player = {
        cards: [] as BoardCard[],
        health: 30,
        gold: 0,
        deck: [
            <Card>{
                id: 3,
                name: "Litwa",
                attack: 3,
                health: 2,
                gold: 3
            }
        ],
        hand: []
    };
    public turnNum = 0;
    public player1Move = true;

    constructor() {}

    get gameEnded() {
        return this.player1.health <= 0 || this.player2.health <= 0;
    }

    get gameData(): Record<string, Omit<Player, "deck" | "hand">> {
        const player1 = { ...this.player1 };
        delete player1.hand;
        delete player1.deck;
        const player2 = { ...this.player2 };
        delete player2.hand;
        delete player2.deck;
        return { player1, player2 };
    }

    public playCard(cardId: number, slot: number) {
        const player = this.player1Move ? 0 : 1;
        if (!(player === 0 || player === 1)) {
            return new GameResponse(false, "Player not valid");
        }
        const playerHand = player === 0 ? this.player1.hand : this.player2.hand;
        const card = playerHand.find(l => l.id === cardId);
        if (!card) {
            return new GameResponse(false, "Card does not exist");
        }
        const arr = player === 0 ? this.player1.cards : this.player2.cards;
        if (arr[slot]) {
            return new GameResponse(false, "Card slot is already filled");
        }
        if (slot > 4) {
            return new GameResponse(false, "Card slot out of bounds");
        }
        arr[slot] = { ...card, attackable: false };
        playerHand.splice(
            playerHand.findIndex(l => l.id === cardId),
            1
        );
        return new GameResponse(true);
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
        if (!attackerCard || attackerId < 2) {
            return new GameResponse(false, "Attacker does not exist");
        }
        if (!receiverCard || receiverId < 2) {
            return new GameResponse(false, "Receiver does not exist");
        }
        attackerCard.health -= receiverCard.attack;
        receiverCard.health -= attackerCard.attack;
        this.removeDeadCards();
        return new GameResponse(true);
    }

    public drawCards(player: number, amount: number = 1) {
        const playerData = player === 0 ? this.player1 : this.player2;
        for (let i = 0; i < amount; i++) {
            const card = playerData.deck.shift();
            if (card) {
                playerData.hand.push(card);
            } else {
                break;
            }
        }
    }

    public startGame() {
        if (this.turnNum === 0) {
            this.turnNum++;
            this.drawCards(0, 3);
            this.drawCards(1, 3);
        }
    }

    public endTurn() {
        if (this.player1Move) {
            this.player1Move = false;
        } else {
            this.player1Move = true;
            this.turnNum++;
            this.drawCards(0);
            this.drawCards(1);
        }
    }
}
