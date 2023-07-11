import { WebSocketServer } from 'ws';
import { WebSocketExtended, wsRoutetypes } from './types/wsRouteTypes.js';
import { Router } from './config/Router.js';
import { CurrentUser } from './entities/User.js';
import { BroadcastController } from './controllers/BroadcastController.js';
import routingMap from './config/routingMap.js';
import srviceLocator from './entities/ServiseLocator.js';

export const wsServerStart = (port: number) => {
  const wss = new WebSocketServer({ port });
  const currentUser = new CurrentUser();
  wss.on('error', (err) => {
    console.log(`WSS ERROR: ${err}`);
  });
  wss.on('connection', (ws: WebSocketExtended) => {
    ws.on('message', (message) => {
      const payload = JSON.parse(message as unknown as string);
      const type: wsRoutetypes | null = payload.type || null;
      const dataRaw: unknown = payload.data || null;
      const broadcastController = new BroadcastController(wss);
      srviceLocator.broadcastController = broadcastController;
      const router = new Router(routingMap);

      if (type !== null) {
        const data = JSON.parse(dataRaw as unknown as string);
        const controller = router.route(type);
        if (controller) {
          controller(ws, data);
        }
        console.log('currentUser', ws?.user);
      } else {
        ws.send('invalid payload');
      }

      console.log('received: %s', message);
    });
  });
  console.log(`WebSocket server started on port ${port}`);
};
