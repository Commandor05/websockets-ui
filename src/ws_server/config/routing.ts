import { wsRoutetypes } from '../types/wsRouteTypes.js';
import { Controller } from '../controllers/Controller.js';
import { PlayerController } from '../controllers/PlayerController.js';

const playerController = new PlayerController();

const routingMap = new Map();

routingMap.set('reg', playerController.playerLogin.bind(playerController));

export const router = (type: wsRoutetypes) => {
  return routingMap.get(type);
};
