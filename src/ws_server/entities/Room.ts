import { RoomUser } from '../types/roomTypes.js';
import { Entity } from './Entity.js';

export class Room extends Entity {
  public roomUsers: RoomUser[] = [];

  constructor(public roomId: number) {
    super();
  }

  addUser(user: RoomUser) {
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
