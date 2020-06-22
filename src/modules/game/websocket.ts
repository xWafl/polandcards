import { websocketHandler } from "../websocket/handler";
import { WSData } from "../websocket/WSData";

const basicMsg = (message: WSData) => {
    const { category, data } = websocketHandler(message.toString());
    console.log(`Category: ${category} | ${data}`);
};

export { basicMsg };
