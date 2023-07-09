import { Player } from './Player.js';

class DataStore {
  public players: Player[] = [];

  constructor() {}

  addPlayer(player: Player) {
    this.players.push(player);
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
