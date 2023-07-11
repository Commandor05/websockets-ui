import WebSocket, { Data, WebSocketServer } from 'ws';
import { Controller } from './Controller.js';

export class BroadcastController extends Controller {
  private webSocketServer: WebSocketServer;
  constructor(webSocketServer: WebSocketServer) {
    super();
    this.webSocketServer = webSocketServer;
  }

  sendOthers(ws: WebSocket, payload: Data): void {
    this.webSocketServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  sendAll(payload: Data): void {
    this.webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
