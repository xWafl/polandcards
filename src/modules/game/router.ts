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

router.post("/joinQueue", requireAuthenticated(), async (ctx, next) => {
    const id = ctx.session!.user;
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
    if (queue.some(l => l.id === userId)) {
        queue.splice(queue.findIndex(l => l.id === userId));
        ctx.body = {
            message: "Success"
        };
    } else {
        throw new HttpError(400, "You are not in the queue");
    }
    await next();
});

export default router.routes();
