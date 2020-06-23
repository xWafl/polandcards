import Router from "./Router";

import usersRouter from "./users/router";
import gamesRouter from "./game/router";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use(usersRouter);
apiRouter.use(gamesRouter);

export default apiRouter.routes();
