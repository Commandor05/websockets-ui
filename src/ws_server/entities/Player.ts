import { PlayerDto, PlayerData } from '../types/playerTypes.js';
import dataStore from './DataStore.js';
import { Entity } from './Entity.js';

import crypto from 'crypto';

export class Player extends Entity {
  public name: string;
  public salt: string;
  public index: number = 0;

  constructor({ name, password }: PlayerDto) {
    super();
    this.name = name;
    this.salt = this.generateSalt(password);
    this.index = dataStore.getNextPlayerIndex();
  }

  private generateSalt(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  public getPlayerData(): PlayerData {
    return {
      name: this.name,
      salt: this.salt,
      index: this.index,
    };
  }

  public checkPassword(password: string): {
    error: boolean;
    errorText: string;
  } {
    const salt = this.generateSalt(password);
    if (salt !== this.salt) {
      return { error: true, errorText: 'Wrong password' };
    }

    return { error: false, errorText: '' };
  }

  static validate({ name, password }: PlayerDto): {
    error: boolean;
    errorText: string;
  } {
    // TODO: validate name and password
    return { error: false, errorText: 'string' };
  }
}
