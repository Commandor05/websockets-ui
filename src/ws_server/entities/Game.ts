import {
  // AttackFeedbackPayload,
  // AttackPayload,
  Ship,
} from '../types/gameTypes.js';
import { GamePlayer, PlayerData } from '../types/playerTypes.js';
import { Entity } from './Entity.js';

export class Game extends Entity {
  public gamePlayers: GamePlayer[] = [];
  private _currentPlayerIndex: number = 0;
  private _isAttackBlocked: boolean = false;

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

  get currentPlayerIndex(): number {
    return this._currentPlayerIndex;
  }

  get isAttackBlocked(): boolean {
    return this._isAttackBlocked;
  }

  bockAttack(): void {
    this._isAttackBlocked = true;
  }

  unBockAttack(): void {
    this._isAttackBlocked = false;
  }

  changeCurrentPlayer(): void {
    const prevIndex = this._currentPlayerIndex;
    this._currentPlayerIndex = prevIndex === 0 ? 1 : 0;
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

  // makeAttack(
  //   attackPayload: Omit<AttackPayload, 'idGame'>,
  // ): AttackFeedbackPayload | null {
  //   const { x, y, indexPlayer } = attackPayload;
  //   const position = { x, y };

  // }
}
