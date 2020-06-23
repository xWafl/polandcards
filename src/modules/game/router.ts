import Router from "koa-router";
import { games } from "./games";
import { Board } from "./actions/board";
import { HttpError } from "../../common/error/classes/httpError";

const router = new Router({ prefix: "/game" });

router.get("/:id", async ctx => {
    const { id } = ctx.params;

    if (games[id]) {
        ctx.body = games[id];
    } else {
        throw new HttpError(400, "The game specified does not exist");
    }
    return games[id];
});

router.post("/createGame", async ctx => {
    const newMaxId =
        Object.keys(games).length === 0
            ? 0
            : Math.max(...Object.keys(games).map(Number)) + 1;
    games[newMaxId].board = new Board();
    games[newMaxId].board.startGame();

    ctx.status = 201;
    return (ctx.body = "Success");
});

export default router.routes();
