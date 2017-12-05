import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {Member} from './Member';
import {Unsubscriber} from '../../service/Unsubscriber';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent extends Unsubscriber implements OnInit {

  teamMembers: Member [] = [];
  team: string;

  constructor(private chatService: ChatService, private _zone: NgZone) {
    super();

    this.subscribeToOnlineUserList();
    this.subscribeToOnlineUserUpdate();
    this.subscribeToDisconnectionEvent();
  }

  ngOnInit() {

  }

  subscribeToOnlineUserList () {
    this.subscriptions.push(
      this.chatService.onJoinEventResponse()
        .subscribe(data => {
          this._zone.run(() => {
            console.log(` Subscription  OnlineUserList => ${JSON.stringify(data)}`);
            this.initiateOnlineUsers(data);
          });
        })
    );
  }

  subscribeToOnlineUserUpdate () {
    this.subscriptions.push(
      this.chatService.onConnectionEvent()
        .subscribe(data => {
          this._zone.run(() => {
            console.log(` Subscription  OnlineUserUpdate t=> ${JSON.stringify(data)}`);
            this.updateOnlineUsers(data);
          });
        })
    );
  }

  subscribeToDisconnectionEvent () {
    this.subscriptions.push(
      this.chatService.onDisconnectionEvent()
        .subscribe(data => {
          this._zone.run(() => {
            console.log(` Subscription  DisconnectionEvent t=> ${JSON.stringify(data)}`);
            this.updateOfflineUsers(data);
          });
        })
    );
  }



  updateOnlineUsers (data) {
    try {
      const user = this.teamMembers.find(member => member.username === data.username);
      if (user) {
        user.setOnlineStatus(true);
      } else {
        this.teamMembers.push(new Member(data.username, true));
      }
    } catch (err) {
      console.log('update online error', err);
    }
  }

  updateOfflineUsers ( data) {
    try {
      const user = this.teamMembers.find(member => member.username === data.username);
      if (user) {
        console.log(`set ${user} is found`);
        user.setOnlineStatus(false);
      }
      console.log(`set ${user} offline`);
    } catch (error) {
      console.log('update offline error', error);
    }
    }

  initiateOnlineUsers (data) {
    try {
      this.team = data.team;
      data.teamMembers.forEach(member => {
        this.teamMembers.push(new Member(member, true));
      });
      console.log(`Initiate Online Users => ${JSON.stringify(this.teamMembers)}`);
    } catch (error) {
      console.log('initiate online users error', JSON.stringify(error));
    }
  }

}
