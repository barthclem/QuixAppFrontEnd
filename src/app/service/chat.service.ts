import { Injectable } from '@angular/core';

import {UserInterface} from '../helpers/userDetails';
import {BehaviorSubject, Subject} from 'rxjs';
import {SendMessage} from '../helpers/SendMessage';
import {TypingMessage} from "../helpers/TypingMessage";

export interface Message {
  author: string;
  team: string;
  message: string;
}

@Injectable()
export class ChatService {

  private sendMessageEvent = new Subject<any>();
  private iamTypingEvent = new Subject<TypingMessage>();
  private joinEvent = new Subject<any>();
  private receiveMessageEvent = new Subject<string>();
  private typingEvent = new Subject<string>();
  private newJoinEvent = new Subject<UserInterface>();

  private joinEventResponse = new BehaviorSubject<any>({});
  private connectionEvent = new BehaviorSubject<any>({});
  private disconnectionEvent = new Subject<any>();

  constructor() {
  }

  fireJoinEventResponse (data) {
    console.log(`Join Event Response => ${JSON.stringify(data)}`);
    this.joinEventResponse.next(data);
  }

  fireConnectionEvent (data) {
    console.log(`Connection Event Response => ${JSON.stringify(data)}`);
    this.connectionEvent.next(data);
  }

  fireDisconnectionEvent (data) {
    console.log(`Disconnection Event Response => ${JSON.stringify(data)}`);
    this.disconnectionEvent.next(data);
  }

  onJoinEventResponse () {
    return this.joinEventResponse;
  }

  onConnectionEvent () {
    return this.connectionEvent;
  }

  onDisconnectionEvent () {
    return this.disconnectionEvent;
  }

  sendMsg(msg: SendMessage) {
    this.sendMessageEvent.next(msg);
  }

  joinChat(userData) {
    this.joinEvent.next(userData);
  }

  iAmTyping(msg: TypingMessage) {
    this.iamTypingEvent.next(msg);
  }

  onSendMessageEvent () {
    return this.sendMessageEvent;
  }

  onJoinChatEvent() {
    return this.joinEvent;
  }

  onIAmTypingEvent () {
    return this.iamTypingEvent;
  }

  fireReceiveMessageEvent (message: string) {
    this.receiveMessageEvent.next(message);
  }

  fireTypingEvent (user: string) {
    this.typingEvent.next(user);
  }

  fireNewComerJoinEvent ( user: UserInterface) {
    this.newJoinEvent.next(user);
  }

  onReceiveMessageEvent () {
    return this.receiveMessageEvent;
  }

  onTypingMessageEvent () {
    return this.typingEvent;
  }

  onNewJoinEvent () {
    return this.newJoinEvent;
  }

}
