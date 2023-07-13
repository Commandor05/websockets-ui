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
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
};
