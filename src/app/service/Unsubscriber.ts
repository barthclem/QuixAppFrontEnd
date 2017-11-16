import {Subscription} from 'rxjs';
/**
 * Created by barthclem on 10/30/17.
 */

export class Unsubscriber {

  protected _subscriptions: Subscription[] = [];

  public constructor() {
    const destroy = (this as any).ngOnDestroy;

    (this as any).ngOnDestroy = function () {
      if (destroy) {
        destroy.bind(this)();
      }

      this.unsubscribe();
    };
  }

  public unsubscribe () {
    for (let i = 0, len = this._subscriptions.length; i < len ; i++) {
      this._subscriptions[i].unsubscribe();
    }

    this._subscriptions = [];
  }

  get subscriptions () {
    return this._subscriptions;
  }
}
