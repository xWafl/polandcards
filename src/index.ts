import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import WebSocket from "ws";

import errorHandler from "./common/error/middleware/errorHandler";

import apiRouter from "./modules/apiRouter";
import { allowCors } from "./modules/cors/middleware/allowCors";
import {
    sendSocket,
    websocketHandler
} from "./modules/websocket/helpers/handler";
import { websocketRoutes } from "./modules/websocket/websocket";

const app = new Koa();

const router = new Router();

const port = process.env.PORT || 5900;

app.use(bodyParser());
app.use(json());
app.use(allowCors());

/* istanbul ignore if */
if (process.env.NODE_ENV === "development") {
    app.use(logger());
}

app.use(errorHandler());

router.use(apiRouter);

app.use(router.routes()).use(router.allowedMethods());

export const server = app.listen(port, () => {
    console.info(`Koa app started and listening on port ${port}!`);
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws: WebSocket) => {
    ws.on("message", _ => websocketRoutes(ws, _));
    ws.send(sendSocket("greeting", `Welcome!`));
});
