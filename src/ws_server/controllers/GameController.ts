import { BattleField } from '../entities/BatteField.js';
import dataStore from '../entities/DataStore.js';
import { Game } from '../entities/Game.js';
import srviceLocator from '../entities/ServiseLocator.js';
import {
  AttackFeedbackPayload,
  AttackPayload,
  CellStatus,
  FinishGamePayload,
  GameData,
  GameDataPayload,
  StartGamePayload,
  Status,
  TurnPayload,
  Winner,
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
    const room = dataStore.getRoomById(roomIndex);
    if (room && room.countUsersInRoom() === 2) {
      dataStore.removeRoomFromRooms(roomIndex);
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

    if (game && data.ships) {
      game.setPlayerShips(idPlayer, data.ships);
      dataStore.updateGame(game);
      if (game.isShipsSetUpDone()) {
        this.startGame(idGame);
      }
    }
  }

  private _addBattleFieldToPlayers(game: Game): void {
    const { gamePlayers } = game;
    if (gamePlayers.length === 2) {
      gamePlayers.forEach((gamePlayer) => {
        const enmyPlayerIndex = gamePlayer.idPlayer === 0 ? 1 : 0;
        const enemyShips = gamePlayers[enmyPlayerIndex].ships;
        if (enemyShips) {
          gamePlayer.battleField = new BattleField(enemyShips);
        }
      });
    }
    dataStore.updateGame(game);
  }

  startGame(idGame: number) {
    const game = dataStore.getGameById(idGame);

    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );
    if (game && game.gamePlayers) {
      this._addBattleFieldToPlayers(game);
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
      this.turn(game);
    }
  }

  turn(game: Game) {
    if (game) {
      const broadcastController = srviceLocator.getService<BroadcastController>(
        'broadcastController',
      );
      const payloadData = { currentPlayer: game.currentPlayerIndex };

      broadcastController &&
        broadcastController.sendAll(
          this.buildPayload<TurnPayload>(payloadData, 'turn'),
        );
    }
  }

  attack(ws: WebSocketExtended, data: AttackPayload) {
    const { gameId: idGame, indexPlayer: idPlayer, x, y } = data;
    const position = { x, y };
    const game = dataStore.getGameById(idGame);
    const { currentPlayerIndex, isAttackBlocked } = game || {};

    if (idPlayer === currentPlayerIndex && !isAttackBlocked) {
      const attackResult =
        game?.gamePlayers[idPlayer].battleField?.attck(position);

      if (attackResult === null) {
        return;
      }

      const attackFeedbackStatus = attackResult?.status || CellStatus.miss;
      const broadcastController = srviceLocator.getService<BroadcastController>(
        'broadcastController',
      );
      if (game && game.gamePlayers) {
        game.blockAttack();
        const attackFeedbackPayload = {
          position,
          currentPlayer: idPlayer,
          status: attackFeedbackStatus as Status,
        };

        broadcastController &&
          broadcastController.sendAll(
            this.buildPayload<AttackFeedbackPayload>(
              attackFeedbackPayload,
              'attack',
            ),
          );

        if (attackFeedbackStatus === CellStatus.killed) {
          const borderPositions = attackResult?.borderPositions;
          const killedPositions = attackResult?.killedPositions;

          borderPositions?.forEach((position) => {
            const attackFeedbackPayload = {
              position,
              currentPlayer: idPlayer,
              status: CellStatus.miss as Status,
            };

            broadcastController &&
              broadcastController.sendAll(
                this.buildPayload<AttackFeedbackPayload>(
                  attackFeedbackPayload,
                  'attack',
                ),
              );
          });

          killedPositions?.forEach((position) => {
            const attackFeedbackPayload = {
              position,
              currentPlayer: idPlayer,
              status: CellStatus.killed as Status,
            };

            broadcastController &&
              broadcastController.sendAll(
                this.buildPayload<AttackFeedbackPayload>(
                  attackFeedbackPayload,
                  'attack',
                ),
              );
          });
        }

        if (game?.gamePlayers[idPlayer]?.battleField?.isGameOver()) {
          dataStore.updateWinners(game.gamePlayers[idPlayer].name);
          this.finishGame(game.currentPlayerIndex).updateWinners();
          dataStore.removeGame(idGame);
          return;
        }

        if (attackFeedbackPayload.status === CellStatus.miss) {
          game.changeCurrentPlayer();
        }

        this.turn(game);
        game.unBlockAttack();
        dataStore.updateGame(game);
      }
    }
  }

  finishGame(winPlayer: number): GameController {
    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );
    const finishGamePayload = { winPlayer };

    broadcastController &&
      broadcastController.sendAll(
        this.buildPayload<FinishGamePayload>(finishGamePayload, 'finish'),
      );
    return this;
  }

  updateWinners() {
    const broadcastController = srviceLocator.getService<BroadcastController>(
      'broadcastController',
    );
    const winnersPayload = dataStore.winners;

    broadcastController &&
      broadcastController.sendAll(
        this.buildPayload<Winner[]>(winnersPayload, 'update_winners'),
      );
  }

  randomAttack(ws: WebSocketExtended, data: TurnPayload) {
    //turn
  }
}
