import { Ship } from '../types/gameTypes.js';
import { GamePlayer, PlayerData } from '../types/playerTypes.js';
import { Entity } from './Entity.js';
import { Player } from './Player.js';

export class Game extends Entity {
  public gamePlayers: GamePlayer[] = [];
  constructor(
    public idGame: number,
    players: PlayerData[],
  ) {
    super();
    this.gamePlayers = players.map((player, i) => {
      const { name, index } = player;
      return { name, index, idPlayer: i };
    });
  }

  getPlayerShips(idPlayer: number): Ship[] {
    return this.gamePlayers[idPlayer].ships || [];
  }

  setPlayerShips(idPlayer: number, ships: Ship[]): void {
    this.gamePlayers[idPlayer].ships = ships;
  }

  isShipsSetUpDone(): boolean {
    return this.gamePlayers.every(
      (player) => player.ships && player.ships.length > 0,
    );
  }
}
