import Router from "./Router";

import usersRouter from "./users/router";
import gamesRouter from "./game/router";
import authRouter from "./auth/router";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use(usersRouter);
apiRouter.use(gamesRouter);
apiRouter.use(authRouter);

export default apiRouter.routes();
