import Router from "../Router";
import { games } from "./games";
import { Board } from "./actions/board";
import { HttpError } from "../../common/error/classes/httpError";
import { requireAuthenticated } from "../auth/middleware/requireAuthenticated";
import { queue } from "./queue";

const router = new Router({ prefix: "/game" });

router.get("/:id", async (ctx, next) => {
    const { id } = ctx.params;

    if (games[id]) {
        ctx.body = games[id];
    } else {
        throw new HttpError(400, "The game specified does not exist");
    }
    await next();
});

router.post("/createGame", async (ctx, next) => {
    const newMaxId =
        Object.keys(games).length === 0
            ? 0
            : Math.max(...Object.keys(games).map(Number)) + 1;
    games[newMaxId] = {
        player1key: "p1",
        player2key: "p2",
        board: new Board()
    };
    games[newMaxId].board.startGame();

    ctx.status = 201;
    ctx.body = newMaxId;
    await next();
});

router.post("/joinQueue", requireAuthenticated(), async (ctx, next) => {
    const id = ctx.session!.user;
    console.log(`New user: ${id} | Queue: `, queue);
    if (!queue.some(l => l.id === id)) {
        queue.push({
            id,
            ws: null
        });
        ctx.body = {
            message: "Success",
            id: id
        };
    } else {
        throw new HttpError(400, "You are already in the queue");
    }
    await next();
});

router.post("/leaveQueue", requireAuthenticated(), async (ctx, next) => {
    const { userId } = ctx.session!.user;
    if (queue.includes(userId)) {
        queue.splice(queue.indexOf(userId));
        ctx.body = {
            message: "Success"
        };
    } else {
        throw new HttpError(400, "You are not in the queue");
    }
    await next();
});

export default router.routes();
