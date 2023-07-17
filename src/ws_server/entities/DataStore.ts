import { Winner } from '../types/gameTypes.js';
import { Game } from './Game.js';
import { Player } from './Player.js';
import { Room } from './Room.js';

class DataStore {
  public players: Player[] = [];
  public rooms = new Map<number, Room>();
  private currentRoomIndex = 0;
  public games = new Map<number, Game>();
  private currentGameIndex = 0;
  private _winners = new Map<string, Winner>();

  constructor() {}

  get winners(): Winner[] {
    return Array.from(this._winners.values());
  }

  updateWinners(winnerName: string) {
    if (this._winners.has(winnerName)) {
      const winner = this._winners.get(winnerName);
      const prevWins = winner?.wins || 0;
      this._winners.set(winnerName, { name: winnerName, wins: prevWins + 1 });
    } else {
      this._winners.set(winnerName, { name: winnerName, wins: 1 });
    }
  }

  getNextRoomIndex() {
    return this.currentRoomIndex;
  }

  getNextGameIndex() {
    return this.currentGameIndex;
  }

  getNextPlayerIndex() {
    return this.players.length;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addGame(game: Game) {
    this.games.set(game.idGame, game);
    this.currentGameIndex++;
  }

  updateGame(game: Game) {
    const { idGame } = game;
    if (this.games.has(idGame)) {
      this.games.set(idGame, game);
    }
  }

  removeGame(idGame: number) {
    if (this.games.has(idGame)) {
      this.games.delete(idGame);
    }
  }

  addRoom(room: Room) {
    this.rooms.set(this.currentRoomIndex, room);
    this.currentRoomIndex++;
  }

  getRooms() {
    return Array.from(this.rooms.values());
  }

  getRoomById(idRoom: number) {
    if (this.rooms.has(idRoom)) {
      return this.rooms.get(idRoom);
    }

    return null;
  }

  updateRoomInRooms(room: Room, roomIndex: number) {
    this.rooms.set(roomIndex, room);
  }

  removeRoomFromRooms(roomIndex: number) {
    console.log('removeRoomFromRooms', roomIndex);
    this.rooms.delete(roomIndex);
  }

  getGameById(idGame: number) {
    if (this.games.has(idGame)) {
      return this.games.get(idGame);
    }

    return null;
  }

  getGameByPlayerName(name: string) {
    for (const [idGame, game] of this.games.entries()) {
      if (game.gamePlayers.find((player) => player.name === name)) {
        return game;
      }
    }

    return null;
  }

  findPlayer(name: string) {
    return this.players.find((player) => player.name === name);
  }

  findPlayerIndex(name: string) {
    return this.players.findIndex((player) => player.name === name);
  }
}

const dataStore = new DataStore();
export default dataStore;
