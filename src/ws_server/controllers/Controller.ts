import WebSocket, { Data } from 'ws';

export abstract class Controller {
  send(ws: WebSocket, payload: Data): void {
    ws.send(payload);
  }

  abstract buildPayload<T>(data: T): Data;
}
