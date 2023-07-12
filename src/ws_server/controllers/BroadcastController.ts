import WebSocket, { Data, WebSocketServer } from 'ws';
import { Controller } from './Controller.js';
import { Service } from '../entities/Service.js';
import { WebSocketExtended } from '../types/wsRouteTypes.js';

export class BroadcastController extends Controller implements Service {
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

  sendByUserName(userName: string, payload: Data): void {
    this.webSocketServer.clients.forEach((client) => {
      const ws: WebSocketExtended = client as WebSocketExtended;
      if (ws?.user?.name === userName && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
