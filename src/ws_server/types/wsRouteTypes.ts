import WebSocket from 'ws';

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
  | 'finish';

export type WebSocketExtended = WebSocket & {
  user?: {
    index: number;
    name: string;
  };
};
