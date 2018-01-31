import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule, Routes } from '@angular/router';

import { AnimatorModule } from 'css-animator';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { ToolbarComponent } from './quiz/toolbar/toolbar.component';
import { QuestionCardComponent } from './quiz/question-card/question-card.component';
import { NavComponent } from './quiz/nav/nav.component';
import { NotificationComponent } from './quiz/notification/notification.component';
import { ChatComponent } from './chat/chat.component';
import { OnlineUsersComponent } from './chat/online-users/online-users.component';
import { DoneComponent } from './done/done.component';
import { PickaQComponent } from './chat/picka-q/picka-q.component';
import { TimerComponent } from './timer/timer.component';

import {WebsocketService} from './service/websocket.service';
import {ChatService} from './service/chat.service';
import {NavService} from './service/nav.service';
import {QuizEventService} from './service/quiz-pane.service';
import {TimeService} from './service/time.service';
import { ChoserComponent } from './quiz/choser/choser.component';
import {QChooserService} from './quiz/choser/service/q-chooser.service';
import {QuizService} from './service/quiz.service';
import {EventSocketService} from './service/event-socket.service';
import { CategoryComponent } from './category/category.component';
import {QuizResultService} from './service/quiz-result.service';
import { HeaderComponent } from './header/header.component';
import {PageService} from './service/page.service';
import { StartPageComponent } from './start-page/start-page.component';
import { IStartComponent } from './i-start/i-start.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import {AudioChatService} from './service/audio-chat.service';
import { ECategoryComponent } from './e-category/e-category.component';


const appRoutes: Routes = [
  {
    path: '', component: StartPageComponent
  },
  {
    path: 'start', component: StartPageComponent
  },
  {
    path: 'end', component: DoneComponent
  },
  {
    path: 'istart', component: IStartComponent
  },
  {
    path: 'quiz', component: QuizComponent
  },
  {
    path: 'chat', component: ChatComponent
  },
  {
    path: 'timer', component: TimerComponent
  },
  {
    path: 'choose', component: ChoserComponent
  },
  {
    path: 's-category', component: CategoryComponent
  },
  {
    path: 'e-category', component: ECategoryComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    ToolbarComponent,
    QuestionCardComponent,
    NavComponent,
    NotificationComponent,
    ChatComponent,
    OnlineUsersComponent,
    DoneComponent,
    PickaQComponent,
    TimerComponent,
    ChoserComponent,
    CategoryComponent,
    HeaderComponent,
    StartPageComponent,
    IStartComponent,
    LeaderBoardComponent,
    ECategoryComponent
  ],
  imports: [
    AnimatorModule, BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule, RouterModule.forRoot(appRoutes)
  ],
  providers: [ ChatService, WebsocketService, NavService,
    QuizEventService, TimeService, QChooserService, QuizService,
    QuizResultService, EventSocketService, PageService, AudioChatService],
  entryComponents: [StartPageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
