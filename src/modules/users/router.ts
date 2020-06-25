import Router from "../Router";

import { createUser } from "./actions/createUser";
import { HttpError } from "../../common/error/classes/httpError";
import findUser from "./actions/findUser";
import { registerBody } from "./schema/registerBody";
import { validateSchema } from "../schema/middleware/validateSchema";
import { RegisterBody } from "./types/RegisterBody";
const router = new Router({ prefix: "/users" });

router.post(
    "/createUser",
    validateSchema(registerBody, "body"),
    async (ctx, next) => {
        const { username, password, email } = ctx.request.body as RegisterBody;

        const user = await createUser({ email, username, password });

        if (!user) {
            throw new HttpError(400, "That username seems to be already taken");
        }

        ctx.session!.user = user.id;
        ctx.status = 201;
        ctx.body = { status: 201, message: "Successfully created" };
        await next();
    }
);

router.get("/userData/:category/:query", async (ctx, next) => {
    const { category, query } = ctx.params;
    const user = await findUser(category, query);
    if (!user) {
        throw new HttpError(400, "No user exists");
    }
    ctx.body = user;
    await next();
});

export default router.routes();
