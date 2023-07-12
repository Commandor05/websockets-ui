import { Game } from './Game.js';
import { Player } from './Player.js';
import { Room } from './Room.js';

class DataStore {
  public players: Player[] = [];
  public rooms: Room[] = [];
  public games: Game[] = [];

  constructor() {}

  getNextRoomIndex() {
    return this.rooms.length;
  }

  getNextGameIndex() {
    return this.rooms.length;
  }

  getNextPlayerIndex() {
    return this.players.length;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addRoom(room: Room) {
    this.rooms.push(room);
  }

  getRooms() {
    return this.rooms;
  }

  updateRoomInRooms(room: Room, roomIndex: number) {
    this.rooms[roomIndex] = room;
  }

  removeRoomFromRooms(roomIndex: number) {
    this.rooms.splice(roomIndex, 1);
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
