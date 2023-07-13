import { Ship } from './gameTypes.js';

export type PlayerDto = {
  name: string;
  password: string;
};

export type PlayerData = {
  name: string;
  salt: string;
  index: number;
};

export type ResponsePlayerData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type GamePlayer = Pick<PlayerData, 'name' | 'index'> & {
  idPlayer: number;
  ships?: Ship[];
};
