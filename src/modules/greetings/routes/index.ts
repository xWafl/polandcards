import Router from "../../Router";

import root from "./root";

const greetingsRouter = new Router({ prefix: "/greetings" });

greetingsRouter.use(root);

export default greetingsRouter.routes();
