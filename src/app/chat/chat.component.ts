import {AfterViewChecked, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../service/chat.service';
import {Unsubscriber} from '../service/Unsubscriber';
import {SendMessage} from '../helpers/SendMessage';
import {TypingMessage} from "../helpers/TypingMessage";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent extends Unsubscriber implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('chatScroll') private chatContainer: ElementRef;

  opened = true;
  team: string;
  username: string;
  text: string;
  letterCount = 0;
  messages: any [] = [];

  constructor(private chatService: ChatService, private _ngZone: NgZone) {
    super();
    this.subscribeToJoinResponse();
    this.subscibeToNewMessage();
    this.subscribeToTypingNotification();
  }

  ngOnInit(): void {
  }

  subscibeToNewMessage () {
    this.subscriptions.push(
    this.chatService.onReceiveMessageEvent()
      .subscribe(data => {
        this._ngZone.run(() => {
          this.addToMessageScroll(data);
        });
      })
    );
  }

  subscribeToTypingNotification () {
    this.subscriptions.push(
      this.chatService.onTypingMessageEvent()
        .subscribe(data => {
          this._ngZone.run(() => {
            this.addToMessageScroll(data);
          });
        })
    );
  }

  subscribeToJoinResponse () {
    this.subscriptions.push(
      this.chatService.onJoinEventResponse()
        .subscribe(data => {
          this._ngZone.run(() => {
            console.log(` Subscription  OnlineUserList => ${JSON.stringify(data)}`);
            this.startChat(data.username, data.team);
          });
        })
    );
  }

  addToMessageScroll(message) {
    this.messages.push({text: message.text, time: '15 mins ago', sender: message.author});
    this.scrollToBottom();
  }

  typingEventHandler(data) {
    if (data.username !== this.username) {
      // this.flash.show(`${data.username} is typing`, {
      //   classes: ['alert', 'alert-info'],
      //   timeout: 1000
      // });
    }

  }

  sendMessage() {
    const message: SendMessage = {
      text: this.text,
      room: this.team,
      author: this.username,
      date: new Date()};
    this.chatService.sendMsg(message);
    this.text = '';
  }

  userIsTyping() {
    if ( this.letterCount++ % 6 === 0 ) {
      const typingMessage: TypingMessage = {
        username: this.username,
        room: this.team};
      this.chatService.iAmTyping(typingMessage);
    }

  }

  startChat( username, room): void {
    this.opened = false;
    this.username = username;
    this.team = room;
  }

  close(): void {
    this.opened = false;
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {

    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {

  }

}
