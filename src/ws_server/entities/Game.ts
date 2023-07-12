import { GamePlayer, PlayerData } from '../types/playerTypes.js';
import { Entity } from './Entity.js';
import { Player } from './Player.js';

export class Game extends Entity {
  public gamePlayers: GamePlayer[] = [];
  constructor(
    public idGame: number,
    public players: PlayerData[],
  ) {
    super();
    this.gamePlayers = players.map((player, i) => {
      const { name, index } = player;
      return { name, index, idPlayer: i };
    });
  }
}
