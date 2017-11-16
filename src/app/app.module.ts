import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule, Routes } from '@angular/router';

import { AnimatorModule } from 'css-animator';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatListModule, MatIconModule, MatTabsModule, MatToolbarModule, MatCardModule, MatSlideToggleModule,
  MatButtonModule, MatMenuModule, MatDialogModule, MatInputModule, MatCheckboxModule, MatSelectModule,
  MatFormFieldModule, MatGridListModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { FreshPageComponent } from './fresh-page/fresh-page.component';
import { HomeComponent } from './home/home.component';
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
import { FreshDialogComponent } from './fresh-page/fresh-dialog/fresh-dialog.component';
import {EventSocketService} from "./service/event-socket.service";


const appRoutes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'fresh', component: FreshPageComponent
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
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    FreshPageComponent,
    HomeComponent,
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
    FreshDialogComponent
  ],
  imports: [
    AnimatorModule, BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule, FlexLayoutModule,
    MatListModule, MatGridListModule, MatTabsModule, MatToolbarModule, MatIconModule, MatCardModule,
    MatSlideToggleModule, MatButtonModule, MatMenuModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatCheckboxModule, MatSelectModule, RouterModule.forRoot(appRoutes),
  ],
  providers: [ ChatService, WebsocketService, NavService,
    QuizEventService, TimeService, QChooserService, QuizService, EventSocketService],
  entryComponents: [DialogComponent, FreshDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
