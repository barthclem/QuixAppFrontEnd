import {Component, OnInit} from '@angular/core';
import {Unsubscriber} from '../../service/Unsubscriber';
import {TimeService} from '../../service/time.service';
import {QuizService} from '../../service/quiz.service';
import {Observable, Subscription} from 'rxjs';
import {NotificationBody} from '../../helpers/NotificationBody';
import {NotificationType} from '../../helpers/NotificationType';
import {NotificationStyle} from '../../helpers/NotificationStyle';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends Unsubscriber implements OnInit {

  public duration: string;
  public notificationMessage: Observable<NotificationBody>;

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

  /**
   * @name selectNotificationCssClass
   * @description - this returns an object that describes the selected style based on the notification type
   * @param notificationType {string} - this is the string that describes the type of notification
   * @return {NotificationStyle}
   */
  selectNotificationCssClass(notificationType: string): NotificationStyle {
    const notificationStyle: NotificationStyle = {};
    switch (notificationType) {
      case NotificationType.WRONG_ANSWER:
        notificationStyle.wrongAnswerInfo = true;
        break;
      case NotificationType.CORRECT_ANSWER:
        notificationStyle.correctAnswerInfo = true;
        break;
      case NotificationType.BONUS_ALERT:
        notificationStyle.bonusInfo = true;
        break;
      case NotificationType.USER_TURN_ALERT:
        notificationStyle.turnToPickInfo = true;
        break;
      default:
        notificationStyle.generalInfo = true;
    }
    return notificationStyle;
  }

}
