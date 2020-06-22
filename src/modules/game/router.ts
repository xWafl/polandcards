import Router from "koa-router";
import { games } from "./games";
import { Board } from "./actions/board";

const router = new Router({ prefix: "/game" });

router.post("/createGame", async ctx => {
    const newMaxId = Math.max(...Object.keys(games).map(Number)) + 1;
    games[newMaxId] = new Board();

    ctx.status = 201;
    return (ctx.body = "Success");
});

export default router.routes();
