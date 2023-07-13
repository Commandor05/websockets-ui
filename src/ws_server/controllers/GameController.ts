import dataStore from '../entities/DataStore.js';
import { Game } from '../entities/Game.js';
import srviceLocator from '../entities/ServiseLocator.js';
import {
  GameData,
  GameDataPayload,
  StartGamePayload,
  TurnPayload,
} from '../types/gameTypes.js';
import { GamePlayer } from '../types/playerTypes.js';
import { WebSocketExtended } from '../types/wsRouteTypes.js';
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

      dataStore.addGame(game);

      const { gamePlayers } = game;

      gamePlayers.forEach((gamePlayer) => {
        const payloadData = { idGame, idPlayer: gamePlayer.idPlayer };
        broadcastController &&
          broadcastController.sendByUserName(
            gamePlayer.name,
            this.buildPayload<GameData>(payloadData, 'create_game'),
          );
      });

      const roomController = new RoomController();

      dataStore.removeRoomFromRooms(roomIndex);
      roomController.updateRoomList();
    }
  }

  addShips(ws: WebSocketExtended, data: GameDataPayload) {
    const { gameId: idGame, indexPlayer: idPlayer } = data;
    const game = dataStore.getGameById(idGame);
    console.log('idGame, idPlayer', idGame, idPlayer);
    console.log('is ships set up done', game?.isShipsSetUpDone());
    if (game && data.ships) {
      game.setPlayerShips(idPlayer, data.ships);
      dataStore.updateGame(game);
      console.log('is done', game.isShipsSetUpDone());
      if (game.isShipsSetUpDone()) {
        this.startGame(idGame);
      }
    }
  }

  startGame(idGame: number) {
    const game = dataStore.getGameById(idGame);
    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );
    if (game && game.gamePlayers) {
      const { gamePlayers } = game;
      gamePlayers.forEach((gamePlayer) => {
        const { ships, idPlayer: currentPlayerIndex } = gamePlayer;
        if (ships) {
          const payloadData = { ships, currentPlayerIndex };
          broadcastController &&
            broadcastController.sendByUserName(
              gamePlayer.name,
              this.buildPayload<StartGamePayload>(payloadData, 'start_game'),
            );
        }
      });
      this.turn(gamePlayers[0]);
    }
  }

  turn(player: GamePlayer) {
    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );
    const payloadData = { currentPlayer: player.idPlayer };

    broadcastController &&
      broadcastController.sendAll(
        this.buildPayload<TurnPayload>(payloadData, 'turn'),
      );
  }
}
