import Router from "koa-router";

import greetingsRouter from "./greetings/routes/";
import gamesRouter from "./game/router";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use(greetingsRouter);
apiRouter.use(gamesRouter);

export default apiRouter.routes();
