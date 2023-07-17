import {
  BattleFieldCell,
  CellStatus,
  Position,
  Ship,
} from '../types/gameTypes.js';
import { Entity } from './Entity.js';

export class BattleField extends Entity {
  private _batteleField = new Map<string, BattleFieldCell>();
  private _targetCellsNumber = 0;

  get batteleField() {
    return this._batteleField;
  }

  constructor(ships: Ship[]) {
    super();
    this._buildBattlefield(ships);
  }

  private _buildBattlefield(ships: Ship[]): void {
    ships.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        const position = {
          x: ship.direction ? ship.position.x : ship.position.x + i,
          y: !ship.direction ? ship.position.y : ship.position.y + i,
        };
        const key = JSON.stringify(position);
        this._batteleField.set(key, {
          status: CellStatus.initial,
          ship,
        });
        this._targetCellsNumber++;
      }
    });
  }

  private _updateAllShipCellsStatus(
    position: Position,
    status: CellStatus,
  ): void {
    const key = JSON.stringify(position);
    if (this._batteleField.has(key)) {
      const cellData = this._batteleField.get(key);
      const ship = cellData?.ship;
      if (ship) {
        const shipCellsStatus: CellStatus[] = [];
        for (let i = 0; i < ship.length; i++) {
          const position = {
            x: ship.direction ? ship.position.x : ship.position.x + i,
            y: !ship.direction ? ship.position.y : ship.position.y + i,
          };
          const key = JSON.stringify(position);
          if (this._batteleField.has(key)) {
            const cellData = this._batteleField.get(key);
            this._batteleField.set(key, { ...cellData, status: status });
          }
        }
      }
    }
  }

  public attck(position: Position): CellStatus {
    const key = JSON.stringify(position);
    const isShipKilled = this._makeShot(position)._isShipKilled(position);
    if (isShipKilled) {
      this._updateAllShipCellsStatus(position, CellStatus.killed);
    }
    return this._batteleField.get(key)?.status || CellStatus.miss;
  }

  private _isShipKilled(position: Position): boolean {
    const key = JSON.stringify(position);
    if (this._batteleField.has(key)) {
      const cellData = this._batteleField.get(key);
      const ship = cellData?.ship;

      if (ship) {
        const shipCellsStatus: CellStatus[] = [];
        for (let i = 0; i < ship.length; i++) {
          const position = {
            x: ship.direction ? ship.position.x : ship.position.x + i,
            y: !ship.direction ? ship.position.y : ship.position.y + i,
          };
          const key = JSON.stringify(position);
          const cellStatus = this._batteleField.get(key)?.status;
          if (cellStatus) {
            shipCellsStatus.push(cellStatus);
          }
        }

        return shipCellsStatus.every((status) => status === CellStatus.shot);
      }
    }

    return false;
  }

  private _makeShot(position: Position): BattleField {
    const key = JSON.stringify(position);
    if (!this._batteleField.has(key)) {
      this._batteleField.set(key, { status: CellStatus.miss });
    } else {
      const cellData = this._batteleField.get(key);
      this._batteleField.set(key, {
        ...cellData,
        status: CellStatus.shot,
      });
    }

    return this;
  }

  isGameOver(): boolean {
    const killedCellsNumber = [...this._batteleField.values()].filter(
      (cell) => cell.status === CellStatus.killed,
    ).length;

    return this._targetCellsNumber === killedCellsNumber;
  }
}
