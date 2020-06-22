import request from "supertest";
import { expect } from "chai";
import { server } from "../../index";
import { games } from "./games";
import { Board } from "./actions/board";

describe("Root route", () => {
    it("Creates a game", async () => {
        await request(server)
            .post("/api/game/createGame")
            .set("Accept", "application/json")
            .expect("Content-Type", /text/)
            .expect(201);

        expect(games[0]).to.deep.equal(new Board());
    });
    it("Gets game data", async () => {
        const response = await request(server)
            .get("/api/game/0")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body).to.deep.equal(new Board());
    });
});
