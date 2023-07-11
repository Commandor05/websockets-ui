import { WebSocketExtended, wsRoutetypes } from '../types/wsRouteTypes.js';

export class Router {
  constructor(
    private _routingMap: Map<
      wsRoutetypes,
      (ws: WebSocketExtended, data: unknown) => {}
    >,
  ) {}

  route(type: wsRoutetypes) {
    return this._routingMap.get(type);
  }
}
