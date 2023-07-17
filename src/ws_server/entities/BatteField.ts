import {
  AttackResult,
  BattleFieldCell,
  CellStatus,
  Position,
  Ship,
  Status,
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
  ): Position[] {
    const positions: Position[] = [];
    const key = JSON.stringify(position);
    if (this._batteleField.has(key)) {
      const cellData = this._batteleField.get(key);
      const ship = cellData?.ship;
      if (ship) {
        for (let i = 0; i < ship.length; i++) {
          const position = {
            x: ship.direction ? ship.position.x : ship.position.x + i,
            y: !ship.direction ? ship.position.y : ship.position.y + i,
          };
          const key = JSON.stringify(position);
          if (this._batteleField.has(key)) {
            const cellData = this._batteleField.get(key);
            this._batteleField.set(key, { ...cellData, status: status });
            positions.push(position);
          }
        }
      }
    }
    return positions;
  }

  public attck(position: Position): AttackResult {
    const key = JSON.stringify(position);
    const isShipKilled = this._makeShot(position)._isShipKilled(position);
    let killedPositions: Position[] | null = null;
    let borderPositions: Position[] | null = null;

    if (isShipKilled) {
      killedPositions = this._updateAllShipCellsStatus(
        position,
        CellStatus.killed,
      );
      borderPositions = this.shotKilledShipBorder(position);
    }
    const result: AttackResult = {
      status:
        (this._batteleField.get(key)?.status as Status) ||
        (CellStatus.miss as Status),
    };

    if (killedPositions) {
      result.killedPositions = killedPositions;
    }

    if (borderPositions) {
      result.borderPositions = borderPositions;
    }

    return result;
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

  public shotKilledShipBorder(position: Position): Position[] {
    const positions = [];
    const key = JSON.stringify(position);
    if (this._batteleField.has(key)) {
      const cellData = this._batteleField.get(key);
      const ship = cellData?.ship;
      if (ship) {
        const startPosition = {
          x: ship.position.x,
          y: ship.position.y,
        };
        const key = JSON.stringify(position);
        if (
          this._batteleField.has(key) &&
          this._batteleField.get(key)?.status === CellStatus.killed
        ) {
          if (ship.direction) {
            for (
              let j = startPosition.y - 1;
              j < startPosition.y + ship.length + 1;
              j++
            ) {
              for (let i = startPosition.x - 1; i <= startPosition.x + 1; i++) {
                if (j >= 0 && j < 10 && i >= 0 && i < 10) {
                  const borderPosition = { x: i, y: j };
                  const borderPositionKey = JSON.stringify(borderPosition);
                  if (!this._batteleField.has(borderPositionKey)) {
                    this._batteleField.set(borderPositionKey, {
                      status: CellStatus.shot,
                    });
                    positions.push(borderPosition);
                  }
                }
              }
            }
          } else {
            for (
              let j = startPosition.x - 1;
              j < startPosition.x + ship.length + 1;
              j++
            ) {
              for (let i = startPosition.y - 1; i <= startPosition.y + 1; i++) {
                if (j >= 0 && j < 10 && i >= 0 && i < 10) {
                  const borderPosition = { x: j, y: i };
                  const borderPositionKey = JSON.stringify(borderPosition);
                  if (!this._batteleField.has(borderPositionKey)) {
                    this._batteleField.set(borderPositionKey, {
                      status: CellStatus.miss,
                    });
                    positions.push(borderPosition);
                  }
                }
              }
            }
          }
        }
      }
    }
    return positions;
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
