import WebSocket from 'ws';
import { PlayerData } from './playerTypes.js';

export type wsRoutetypes =
  | 'reg'
  | 'update_winners'
  | 'create_room'
  | 'add_user_to_room'
  | 'create_game'
  | 'update_room'
  | 'add_ships'
  | 'start_game'
  | 'attack'
  | 'randomAttack'
  | 'turn'
  | 'connection_close'
  | 'finish';

export type WebSocketExtended = WebSocket & {
  user?: PlayerData;
};
