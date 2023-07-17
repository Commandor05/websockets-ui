import { GameController } from '../controllers/GameController.js';
import { PlayerController } from '../controllers/PlayerController.js';
import { RoomController } from '../controllers/RoomController.js';

const playerController = new PlayerController();
const roomController = new RoomController();
const gameController = new GameController();

const routingMap = new Map();

routingMap.set('reg', playerController.playerLogin.bind(playerController));
routingMap.set('create_room', roomController.createRoom.bind(roomController));
routingMap.set(
  'add_user_to_room',
  roomController.addUserToRoom.bind(roomController),
);
routingMap.set('add_ships', gameController.addShips.bind(gameController));
routingMap.set('attack', gameController.attack.bind(gameController));
export default routingMap;
