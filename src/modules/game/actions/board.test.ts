import { expect } from "chai";
import { Board } from "./board";
import { BoardCard, Card } from "../types/Card";

describe("Board class", () => {
    const myCard: BoardCard = {
        id: 2,
        name: "Poland",
        attack: 3,
        health: 4,
        gold: 3,
        attackable: false
    };
    const myOtherCard: Card = {
        id: 3,
        name: "Poland",
        attack: 3,
        health: 2,
        gold: 3
    };
    describe("Card placement", () => {
        it("Adds a card", () => {
            const board = new Board();
            board.startGame();
            board.playCard(2, 0);
            expect(board.player1.cards[0]).to.deep.equal(myCard);
        });
        it("Does not add a card on an already placed card", () => {
            const board = new Board();
            board.startGame();
            board.playCard(2, 0);
            board.playCard(4, 0);
            expect(board.player1.cards[0]).to.deep.equal(myCard);
        });
        it("Has correct error for adding a card on an already placed card", () => {
            const board = new Board();
            board.startGame();
            board.playCard(2, 0);
            const status = board.playCard(4, 0);
            expect(status.reason).to.equal("Card slot is already filled");
        });
    });
    describe("Card attacking", () => {
        const board = new Board();
        board.startGame();
        board.playCard(2, 0);
        board.endTurn();
        board.playCard(3, 0);
        board.endTurn();
        board.attack(2, 3);
        it("The attacker takes damage", () => {
            expect(board.player1.cards[0]).to.deep.equal({
                ...myCard,
                health: 1
            });
        });
        it("The receiver dies", () => {
            expect(board.player2.cards[0]).to.equal(undefined);
        });
    });
});
