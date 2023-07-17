import { Controller } from './Controller.js';
import { PlayerDto, ResponsePlayerData } from '../types/playerTypes.js';
import dataStore from '../entities/DataStore.js';
import { Player } from '../entities/Player.js';
import { WebSocketExtended } from '../types/wsRouteTypes.js';
import { RoomController } from './RoomController.js';

export class PlayerController extends Controller {
  constructor() {
    super();
  }

  playerLogin(ws: WebSocketExtended, data: PlayerDto) {
    let error = false;
    let errorText = '';
    const { name, password } = data;

    let player = dataStore.findPlayer(name);

    if (!player) {
      player = new Player(data);
      dataStore.addPlayer(player);
    } else {
      let passwordIsCorrect = player.checkPassword(password);
      if (!passwordIsCorrect.error) {
        error = passwordIsCorrect.error;
        errorText = passwordIsCorrect.errorText;
      }
    }

    const { index, salt } = player;

    ws.user = { name, index, salt };

    const respData = {
      name,
      index,
      error,
      errorText,
    };
    const rooms = dataStore.getRooms();
    if (rooms) {
      const roomControllr = new RoomController();
      roomControllr.updateRoomList();
    }

    this.send(ws, this.buildPayload<ResponsePlayerData>(respData, 'reg'));
  }
}
