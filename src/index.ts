import { WebSocket, WebSocketServer } from "ws";
import { httpServer } from "./http_server";
import { controller } from "./services/controller";
import "./services/bot";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WS_PORT = 3000;
console.log(`WebSocket server on the ${WS_PORT} port!`);

interface CustomWebSocket extends WebSocket {
  userId: string;
}

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function connection(ws: CustomWebSocket, request) {
  const url = new URL(request.url, `ws://${request.headers.host}`);
  const botId = url.searchParams.get("bot");

  const userId = botId ? botId : crypto.randomUUID();

  ws.userId = userId;

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const clientMessage = data.toString();
    console.log("<-- cmd from frontend:", clientMessage);

    const processedDataArray = controller(userId, clientMessage).filter(
      (data) => data !== undefined
    );

    if (processedDataArray.length === 0) return;

    for (const processedData of processedDataArray) {
      wss.clients.forEach((client) => {
        const customClient = client as CustomWebSocket;

        if (processedData.clientIds.includes(customClient.userId)) {
          const serverMessage = JSON.stringify({
            type: processedData.type,
            data: JSON.stringify(processedData.data),
            id: 0,
          });

          console.log(`--> server answer to: ${customClient.userId}`, serverMessage);

          client.send(serverMessage);
        }
      });
    }
  });
});
