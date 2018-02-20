import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {WebsocketService} from './websocket.service';
import {TimeService} from './time.service';
import {QuizEventService} from './quiz-pane.service';
import {Unsubscriber} from './Unsubscriber';
import {
  ChatEventRegistry, EventRegistry, NavEventRegistry, QuizEventRegistry,
  TimeEventRegistry
} from '../helpers/EventRegistry';
import {ChatService} from './chat.service';
import {QChooserService} from '../quiz/choser/service/q-chooser.service';
import {QuizResultService} from './quiz-result.service';
import {AudioChatService} from './audio-chat.service';

@Injectable()
export class EventSocketService extends Unsubscriber {

  socketServer: Subject<any>;
  constructor(
    private webSocket: WebsocketService,
  private timeService: TimeService,
  private quizEventService: QuizEventService,
  private quizResultService: QuizResultService,
  private chatService: ChatService,
  private chooserService: QChooserService,
    private audioChatService: AudioChatService
  ) {
    super();

}

subscribeToAllEvent(gamePort: number): boolean {
  this.socketServer = <Subject<any>> this.webSocket.connect(gamePort)
    .map((response: any): any => response);

  this.subscribeToChatEvents();
  this.subscribeToQuizEvents();
  this.subscribeToSocketEvents();
  this.subscribeToTimeEvents();
  return true;
}

 subscribeToTimeEvents () {
    this.subscriptions.push(
    this.timeService.onTimeForQuestionExpired()
      .subscribe(
        () =>
        this.socketServer.next({event: TimeEventRegistry.TIME_FOR_QUESTION_EXPIRED_EVENT})
      ));

   this.subscriptions.push(
    this.timeService.onStartPageEnd()
      .subscribe(  () =>
        this.socketServer.next({event: TimeEventRegistry.START_PAGE_END_EVENT})
      ));

   this.subscriptions.push(
     this.timeService.onEntryPageTimerStopped()
       .subscribe(  () => {
        // this.socketServer.next({event: TimeEventRegistry.ENTRY_PAGE_TIMER_STOPPED_EVENT});
         // if (this.timeService.localTimerStarted) {
         //   console.log(`You can't stop timer... Timer Already stopped`);
         // } else {
         //   this.socketServer.next({event: TimeEventRegistry.ENTRY_PAGE_TIMER_STOPPED_EVENT});
         // }
         }
       )
   );

   this.subscriptions.push(
     this.timeService.onInterBreakFinished()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.INTER_BREAK_FINISHED_EVENT})
       )
   );

   this.subscriptions.push(
     this.timeService.onQuestionAlert()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.QUESTION_ALERT_EVENT}))
   );


   this.subscriptions.push(
     this.timeService.onTeamBonus()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.TEAM_BONUS_EVENT}))
   );

   this.subscriptions.push(
     this.timeService.onTeamTurn()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.TEAM_TURN_EVENT}))
   );

   this.subscriptions.push(
     this.timeService.onTimeForBonusExpired()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.TIME_FOR_BONUS_EXPIRED}))
   );

   this.subscriptions.push(
     this.timeService.onEntryPageTimerStarted()
       .subscribe( () =>
         this.socketServer.next({event: TimeEventRegistry.ENTRY_PAGE_TIMER_STARTED_EVENT}))
   );
 }

  subscribeToQuizEvents() {
    this.subscriptions.push(
      this.quizEventService.onQuestionAnswered()
        .subscribe(
          answer => {
            this.socketServer.next({event: QuizEventRegistry.QUESTION_ANSWERED_EVENT,
            optionSelected: answer});
          }
        )
    );


    this.subscriptions.push(
      this.quizEventService.onQuestionSelected()
        .subscribe(  questionNumber => {
          if (questionNumber > -1 ) {
            this.socketServer.next({event: QuizEventRegistry.QUESTION_SELECTED_EVENT,
              questionSelected: questionNumber}
            );
          }
        })
    );

    // this.subscriptions.push(
    //   this.quizEventService.onBonusLoaded()
    //     .subscribe(
    //       () => {
    //         this.socketServer.next({event: QuizEventRegistry.ANSWERED_LOADED_EVENT});
    //       }
    //     )
    // );

    this.subscriptions.push(
      this.quizEventService.onBonusAttempted()
        .subscribe(
          answer => {
            this.socketServer.next({event: QuizEventRegistry.BONUS_ATTEMPTED_EVENT,
              optionSelected: answer});
          })
    );


    this.subscriptions.push(
      this.quizEventService.onUserDetialsTaken()
        .subscribe( (userData) => {
          console.log(`WS  Trying to join`);
          this.socketServer.next({event: EventRegistry.JOIN_EVENT,
          user: userData});
        })
    );

  }

  subscribeToSocketEvents() {
    this.subscriptions.push(
      this.socketServer.subscribe(
        responseObject => {
          const messageObject = responseObject.data;
          const eventName = responseObject.type;
          this.handleResponseEvents(eventName, messageObject, responseObject);
        }
      )
    );
  }

  subscribeToChatEvents() {

   this.subscriptions.push(
     this.chatService.onSendMessageEvent()
       .subscribe(data => {
         this.socketServer.next({event: ChatEventRegistry.MESSAGE_EVENT,
         data: data});
       })
   );

   this.subscriptions.push(
     this.chatService.onIAmTypingEvent()
       .subscribe(data => {
         this.socketServer.next({event: ChatEventRegistry.I_AM_TYPING_EVENT,
         data: data});
       })
   );

   this.subscriptions.push(
     this.chatService.onJoinChatEvent()
       .subscribe(data => {
         this.socketServer.next({
           event: ChatEventRegistry.JOIN_EVENT,
           data: data
         });
       })
   );
  }

  handleResponseEvents( eventName: string, message: any, responseObject: any) {
    console.log(`Handle Response Event --eventName => ${eventName}`);
    switch (eventName) {
      case TimeEventRegistry.TIME_FOR_BONUS_EXPIRED:
        this.timeService.timeForBonusExpired();
        break;
      case TimeEventRegistry.TEAM_TURN_EVENT:
        this.timeService.teamTurn();
        break;
      case TimeEventRegistry.TEAM_BONUS_EVENT:
        this.timeService.teamBonus();
        break;
      case TimeEventRegistry.QUESTION_ALERT_EVENT:
        this.timeService.questionAlert();
        break;
      case TimeEventRegistry.INTER_BREAK_FINISHED_EVENT:
        this.timeService.interBreakFinished();
        break;
      case TimeEventRegistry.TIME_FOR_QUESTION_EXPIRED_EVENT:
        this.timeService.timeForQuestionExpired();
        break;
      case TimeEventRegistry.ENTRY_PAGE_TIMER_STOPPED_RESPONSE:
        this.timeService.onlineTimerStopped = true;
        this.timeService.entryPageTimerStopped();
        break;
      case TimeEventRegistry.ONLINE_TIME_RESPONSE:
        this.timeService.fireOnlinePageTimerEvent(message.currentTime);
        break;
      case TimeEventRegistry.START_PAGE_END_EVENT:
        this.timeService.startPageEnd();
        break;
      case TimeEventRegistry.ENTRY_PAGE_TIMER_STOPPED_EVENT :
        this.timeService.entryPageTimerStopped();
        break;
      case QuizEventRegistry.START_OF_NEW_CATEGORY:
        console.log(`Start of New Category => ${JSON.stringify(message)}`);
        this.quizEventService.fireNewCategoryEvent({stageName :  message.stageName,
          noOfRounds: message.noOfRounds,
          teams: message.teams});
        break;
      case QuizEventRegistry.END_OF_CATEGORY:
        console.log(`End of Category`);
        this.quizEventService.fireEndOfCategoryEvent();
        break;
      case QuizEventRegistry.USER_TURN_TO_PICK_QUESTION_EVENT:
        this.chooserService.questionTag = message.questionTags;
        this.quizEventService.fireUserTurnToPickQuestionEvent(message);
        break;
      case QuizEventRegistry.PICK_NOTIFY_ALL:
        this.quizEventService.fireTeamHasPickedAQuestion(message.content);
        break;
      case QuizEventRegistry.PICK_NOTIFY_TEAM:
        this.quizEventService.fireTeamMateHasPickedAQuestion(message);
        break;
      case QuizEventRegistry.QUESTION_LOADED_EVENT:
        console.log(`Question loaded => ${JSON.stringify(message)}`);
        // fireBonusLoadedEvent
        this.quizEventService.fireQuestionLoadedEvent(message);
        break;
      case QuizEventRegistry.ANSWERED_LOADED_EVENT:
        console.log(`Answered loaded => ${JSON.stringify(message)}`);
        this.quizEventService.fireAnswerLoadedEvent(message);
        break;
      case QuizEventRegistry.BONUS_LOADED_EVENT:
        console.log(`Bonus loaded => ${JSON.stringify(message)}`);
        this.quizEventService.fireBonusLoadedEvent(message.teamName);
        break;
      case QuizEventRegistry.BONUS_ATTEMPTED_EVENT:
        this.quizEventService.bonusAttempted(message);
        break;
      case QuizEventRegistry.END_OF_QUIZ_EVENT:
        this.quizEventService.fireEndOfQuixCompetition();
        break;

      case NavEventRegistry.UPDATE_SCORE:
        console.log(`=> Update teams details and information => ${JSON.stringify(message.teams)}`);
        this.quizResultService.updateTeamList(message.teams);
        break;

      case ChatEventRegistry.NEW_MESSAGE_EVENT:
        this.chatService.fireReceiveMessageEvent(message);
        break;

      case ChatEventRegistry.TYPING_EVENT:
        this.chatService.fireTypingEvent(message);
        break;

      case ChatEventRegistry.JOIN_EVENT_RESPONSE:
        this.chatService.fireJoinEventResponse(message);
        this.timeService.setOnlineTimerStatus(responseObject.timerStarted);
        this.audioChatService.setUpAudioService(message.team);
        break;

      case ChatEventRegistry.CONNECTION_EVENT:
        this.chatService.fireConnectionEvent(message);
        break;

      case ChatEventRegistry.DISCONNECTION_EVENT:
        this.chatService.fireDisconnectionEvent(message);
        break;

      default:
        console.log(`Unsupported Event -> ${eventName}`);
    }
  }
}
