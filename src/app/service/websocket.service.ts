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


  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {

    this.socket = io(environment.ws_url);

    const observable = new Observable( (observer: Rx.Observer<MessageEvent>) => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: SocketEvent) => {
        console.log(` Socket Data is => ${JSON.stringify(data)}`);
        const event = data.event;
        delete data.event;
        this.socket.emit(event, data);
      }
    };

    return Rx.Subject.create(observer, observable);

  }

}

