import { WebSocketServer } from 'ws';
import { wsRoutetypes } from './types/wsRouteTypes.js';
import { router } from './config/routing.js';

export const wsServerStart = (port: number) => {
  const wss = new WebSocketServer({ port });
  wss.on('error', (err) => {
    console.log(`WSS ERROR: ${err}`);
  });
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const payload = JSON.parse(message as unknown as string);
      const type: wsRoutetypes | null = payload.type || null;
      const dataRaw: any = payload.data || null;

      if (type !== null && dataRaw !== null) {
        const data = JSON.parse(dataRaw as unknown as string);
        const controller = router(type);
        if (controller) {
          controller(data, ws);
        }
      } else {
        ws.send('invalid payload');
      }

      console.log('received: %s', message);
    });
  });
  console.log(`WebSocket server started on port ${port}`);
};
