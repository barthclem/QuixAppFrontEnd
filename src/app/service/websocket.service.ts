import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../environments/environment';

export interface SocketEvent {
  event: string;
}

@Injectable()
export class WebsocketService {

  private _socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {

    this._socket = io(environment.ws_url_secure);

    const observable = new Observable( (observer: Rx.Observer<MessageEvent>) => {
      this._socket.on('response', (data) => {
        observer.next(data);
      });
      return () => {
        this._socket.disconnect();
      };
    });

    const observer = {
      next: (data: SocketEvent) => {
        console.log(`WS Socket Data is => ${JSON.stringify(data)}`);
        const event = data.event;
        delete data.event;
        this._socket.emit(event, data);
      }
    };

    return Rx.Subject.create(observer, observable);

  }

  get socket() {
    return this._socket;
  }
}

