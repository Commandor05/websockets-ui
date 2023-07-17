export type GameData = {
  idGame: number;
  idPlayer: number;
  ships?: Ship[];
};

export type GameDataPayload = {
  gameId: number;
  indexPlayer: number;
  ships: Ship[];
};

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export enum CellStatus {
  miss = 'miss',
  killed = 'killed',
  shot = 'shot',
  initial = 'initial',
}

export type StartGamePayload = {
  ships: Ship[];
  currentPlayerIndex: number;
};

export type TurnPayload = {
  currentPlayer: number;
};

export type AttackPayload = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackFeedbackPayload = {
  position: Position;
  currentPlayer: number;
  status: Status;
};

export type Position = {
  x: number;
  y: number;
};

export type Status = 'miss' | 'killed' | 'shot';

export type BattleFieldCell = {
  ship?: Ship;
  status: CellStatus;
};

export type FinishGamePayload = {
  winPlayer: number;
};

export type Winner = {
  name: string;
  wins: number;
};

export type AttackResult = {
  status: Status;
  killedPositions?: Position[];
  borderPositions?: Position[];
};
