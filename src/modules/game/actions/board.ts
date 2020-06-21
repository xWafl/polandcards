class Board {
    public readonly player1: Card[] = Array(4);
    public readonly player2: Card[] = Array(4);
    public player1health = 30;
    public player2health = 30;
    public turnNum = 0;
    public player1Move = true;

    constructor() {}

    public playCard(player: number, card: Card, slot: number) {
        if (player === 1 || player === 2) {
            const arr = player === 1 ? this.player1 : this.player2;
            if (!arr[slot]) {
                arr[slot] = card;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public attack(attackerId: number, receiverId: number) {
        const attackerCards = this.player1Move ? this.player1 : this.player2;
        const receiverCards = !this.player1Move ? this.player1 : this.player2;
        const attackerCard = attackerCards.find(l => l.id === attackerId);
        const receiverCard = receiverCards.find(l => l.id === receiverId);
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
