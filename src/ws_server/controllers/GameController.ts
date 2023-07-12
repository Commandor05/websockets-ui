import dataStore from '../entities/DataStore.js';
import { Game } from '../entities/Game.js';
import srviceLocator from '../entities/ServiseLocator.js';
import { gameCreateData } from '../types/gameTypes.js';
import { BroadcastController } from './BroadcastController.js';
import { Controller } from './Controller.js';
import { RoomController } from './RoomController.js';

export class GameController extends Controller {
  constructor() {
    super();
  }

  createGame(roomIndex: number) {
    const room = dataStore.getRooms()[roomIndex];
    if (room.countUsersInRoom() === 2) {
      const idGame = dataStore.getNextGameIndex();
      const game = new Game(idGame, room.roomUsers);
      const broadcastController = srviceLocator.getService<BroadcastController>(
        'broadcastController',
      );

      const { gamePlayers } = game;
      gamePlayers.forEach((gamePlayer) => {
        const payloadData = { idGame, idPlayer: gamePlayer.idPlayer };
        broadcastController &&
          broadcastController.sendByUserName(
            gamePlayer.name,
            this.buildPayload<gameCreateData>(payloadData, 'create_game'),
          );
      });
      dataStore.removeRoomFromRooms(roomIndex);
      const roomController = new RoomController();
      roomController.updateRoomList();
    }
  }
}
