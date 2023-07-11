export type PlayerDto = {
  name: string;
  password: string;
};

export type PlayerData = {
  name: string;
  salt: string;
};

export type ResponsePlayerData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};
