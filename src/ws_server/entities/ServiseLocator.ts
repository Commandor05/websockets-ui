import { BroadcastController } from '../controllers/BroadcastController.js';

class ServiceLocator {
  private _broadcastController: BroadcastController | null = null;
  constructor() {}

  public set broadcastController(
    broadcastController: BroadcastController | null,
  ) {
    if (broadcastController) {
      this._broadcastController = broadcastController;
    }
  }

  public get broadcastController() {
    return this._broadcastController || null;
  }
}

const srviceLocator = new ServiceLocator();
export default srviceLocator;
