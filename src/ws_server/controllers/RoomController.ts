import { Controller } from './Controller.js';
import dataStore from '../entities/DataStore.js';
import { Room } from '../entities/Room.js';
import { WebSocketExtended } from '../types/wsRouteTypes.js';
import srviceLocator from '../entities/ServiseLocator.js';

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
    const room = dataStore.getRooms()[indexRoom];
    const user = ws.user;
    if (room && user) {
      room.addUser(user);
      dataStore.updateRoomInRooms(room, indexRoom);
      this.updateRoomList();
    }
  }

  updateRoomList() {
    const rooms = dataStore.getRooms();
    const broadcastController = srviceLocator.broadcastController;
    if (rooms.length > 0 && broadcastController) {
      broadcastController.sendAll(
        this.buildPayload<Room[]>(rooms, 'update_room'),
      );
    }
  }
}
