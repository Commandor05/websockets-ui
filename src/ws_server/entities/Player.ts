import { PlayerDto, PlayerData } from '../types/playerTypes.js';
import { Entity } from './Entity.js';

import crypto from 'crypto';

export class Player extends Entity {
  public name: string;
  public salt: string;

  constructor({ name, password }: PlayerDto) {
    super();
    this.name = name;
    this.salt = this.generateSalt(password);
  }

  private generateSalt(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  public getPlayerData(): PlayerData {
    return {
      name: this.name,
      salt: this.salt,
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
