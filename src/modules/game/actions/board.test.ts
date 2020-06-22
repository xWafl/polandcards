import { expect } from "chai";
import { Board } from "./board";
import { Card } from "../types/Card";

describe("Board class", () => {
    const myCard: Card = {
        id: 2,
        name: "Poland",
        attack: 3,
        health: 4,
        gold: 3
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
            board.playCard(0, myCard, 0);
            expect(board.player1[0]).to.deep.equal(myCard);
        });
        it("Does not add a card on an already placed card", () => {
            const board = new Board();
            board.playCard(0, myCard, 0);
            board.playCard(0, myOtherCard, 0);
            expect(board.player1[0]).to.deep.equal(myCard);
        });
    });
    describe("Card attacking", () => {
        const board = new Board();
        board.playCard(0, myCard, 0);
        board.playCard(1, myOtherCard, 0);
        board.attack(2, 3);
        it("The attacker takes damage", () => {
            expect(board.player1[0]).to.deep.equal({
                ...myCard,
                ...{ health: 1 }
            });
        });
        it("The receiver takes damage", () => {
            expect(board.player2[0]).to.equal(undefined);
        });
    });
});
