import { PlayerData } from '../types/playerTypes.js';
import { Entity } from './Entity.js';

export class Room extends Entity {
  public roomUsers: PlayerData[] = [];

  constructor(public roomId: number) {
    super();
  }

  addUser(user: PlayerData) {
    const findUser = this.roomUsers.find((u) => u.name === user.name);
    if (findUser === undefined) {
      this.roomUsers.push(user);
    }
    return this;
  }

  countUsersInRoom() {
    return this.roomUsers.length;
  }
}
