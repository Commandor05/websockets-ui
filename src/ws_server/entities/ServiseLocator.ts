import { BroadcastController } from '../controllers/BroadcastController.js';
import { Service } from './Service.js';

class ServiceLocator {
  private _services = new Map<string, Service>();
  constructor() {}

  public addService(id: string, service: Service) {
    if (!this._services.has(id)) {
      !this._services.set(id, service);
    }
  }

  public getService<T>(id: string) {
    if (this._services.has(id)) {
      return this._services.get(id) as T;
    }
    return null;
  }

  public hasService(id: string) {
    return this._services.has(id);
  }
}

const srviceLocator = new ServiceLocator();
export default srviceLocator;
