import WebSocket, { Data } from 'ws';
import { wsRoutetypes } from '../types/wsRouteTypes.js';
import { ResponsePayload } from '../types/responseTypes.js';

export abstract class Controller {
  send(ws: WebSocket, payload: Data): void {
    ws.send(payload);
  }

  buildPayload<T>(respData: T, type: wsRoutetypes) {
    const resp: ResponsePayload = {
      type,
      data: JSON.stringify(respData),
      id: 0,
    };
    return JSON.stringify(resp);
  }
}
