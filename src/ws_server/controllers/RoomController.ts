import { Controller } from './Controller.js';
import dataStore from '../entities/DataStore.js';
import { Room } from '../entities/Room.js';
import { WebSocketExtended } from '../types/wsRouteTypes.js';
import srviceLocator from '../entities/ServiseLocator.js';
import { GameController } from './GameController.js';
import { BroadcastController } from './BroadcastController.js';

export class RoomController extends Controller {
  constructor() {
    super();
  }

  createRoom(ws: WebSocketExtended) {
    const roomIndex = dataStore.getNextRoomIndex();
    const room = new Room(roomIndex);
    const user = ws.user;
    if (user) {
      room.addUser(user);
    }

    dataStore.addRoom(room);
    const rooms = dataStore.getRooms();

    this.updateRoomList();
  }

  addUserToRoom(ws: WebSocketExtended, data: { indexRoom: number }) {
    const { indexRoom } = data;
    const room = dataStore.getRoomById(indexRoom);
    const user = ws.user;
    if (room && user) {
      room.addUser(user);
      dataStore.updateRoomInRooms(room, indexRoom);
      const gameController = new GameController();
      gameController.createGame(indexRoom);

      this.updateRoomList();
    }
  }

  updateRoomList() {
    const rooms = dataStore.getRooms();
    const gameController = new GameController();
    gameController.updateWinners();
    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );

    if (broadcastController) {
      broadcastController.sendAll(
        this.buildPayload<Room[]>(rooms, 'update_room'),
      );
    }
  }
}
