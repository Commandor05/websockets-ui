import { Controller } from './Controller.js';
import {
  PlayerDto,
  ResponsePlayerData,
  ResponsePlayerPayload,
} from '../types/playerTypes.js';
import WebSocket from 'ws';
import dataStore from '../entities/DataStore.js';
import { Player } from '../entities/Player.js';

export class PlayerController extends Controller {
  constructor() {
    super();
  }

  playerLogin(data: PlayerDto, ws: WebSocket) {
    console.log('player login DATA: ', data);
    console.log('this', this);
    console.log('name', data.name);
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

    const respData = {
      name,
      index: dataStore.findPlayerIndex(name),
      error,
      errorText,
    };

    this.send(ws, this.buildPayload<ResponsePlayerData>(respData));
  }

  buildPayload<T>(respData: T) {
    const resp: ResponsePlayerPayload = {
      type: 'reg',
      data: JSON.stringify(respData),
      id: 0,
    };
    return JSON.stringify(resp);
  }
}
