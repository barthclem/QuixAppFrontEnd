import { Component, OnInit } from '@angular/core';
import {Unsubscriber} from '../../service/Unsubscriber';
import {TimeService} from '../../service/time.service';
import {QuizService} from '../../service/quiz.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends Unsubscriber implements OnInit {

  public duration: string;
  public notificationMessage: Observable<string>;

  constructor(private timeService: TimeService, private quizService: QuizService) {
    super();
    this.subscribeToDurationUpdate();
    this.notificationMessage = this.quizService.getMessage();
  }

  ngOnInit() {
  }

  subscribeToDurationUpdate() {
    this.subscriptions.push(
    this.timeService.getRemainingDuration()
      .subscribe((time) => {
        this.duration = ` ${time.minutes} min : ${time.seconds} sec`;
      })
    );
  }

}
