import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../service/time.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Unsubscriber} from '../service/Unsubscriber';
import {AnimationService, AnimationBuilder} from 'css-animator';
import {PageService} from '../service/page.service';
import {QuizEventService} from '../service/quiz-pane.service';
import {QuizService} from '../service/quiz.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent extends Unsubscriber implements OnInit, OnDestroy {


  seconds: number;
  minutes: number;
  timeString: string;
  onlineTime: number;

  timeSub: Subscription;
  onlineTimeSub: Subscription;

  private _animator: AnimationBuilder;

  constructor(
    private pageService: PageService,
    private timeService: TimeService,
    private router: Router,
    private quizEventService: QuizEventService,
    private quizService: QuizService,
    private animationService: AnimationService,
    private _elementRef: ElementRef
  ) {
    super();
    this.initiatePage();
    this.subscribeToPageTimerStopped();
    this.subscribeToPageTimerResponse();
    this.subscribeToNewCategory();
    this._animator = this.animationService.builder();
    console.log(`The time Service onlineTimer Started => ${this.timeService.onlineTimerStarted}`);
        if (this.timeService.onlineTimerStarted) {
    this.subscribeToPageTimerResponse();
    }
  }

  ngOnInit() {
    console.log(`Init this guy mehn --- I mean for real (-_-)`);
    this.fadeInAnimation();
    if (!this.timeService.onlineTimerStarted) {
      this.startTimer();
    }
  }

  fadeInAnimation () {
    this._animator
      .setType('fadeInRight')
      .setDelay(100)
      .setDuration(700)
      .show(this._elementRef.nativeElement)
      .then(() => { console.log('Timer Page is loaded'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }

  fadeOut() {
    this._animator
      .setType('fadeOutLeft')
      .setDelay(100)
      .setDuration(700)
      .hide(this._elementRef.nativeElement)
      .then(() => {
      this.timeService.endOfACategory = false; this.router.navigate(['s-category']);
      console.log('Timer Page is Out for now'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }

  initiatePage (): void {
    console.log(`TIMER Initiate Page ---- Start Page Right Now`);
    this.pageService.enableTeamMembersDisplay(true);
    this.pageService.setPageTitle('Timer');
  }
  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }


  startTimer () {
    this.timeService.entryPageTimerStarted(1);
    this.timeService.localTimerStarted = true;
  }


  getMinute ( time: number) {
    return Math.floor(time / 60);
  }

  getSeconds ( time: number) {
    return time % 60;
  }


  subscribeToPageTimerStopped() {
    this.subscriptions.push(
      this.timeService.onEntryPageTimerStopped()
        .subscribe(() => {
          console.log(` Please subscribe now -- `);
         // this.fadeOut();
          this.timeService.startPageEnd();
        }, (error) => { console.log(` PageTimer Stopped Error => ${error}`); })
    );
  }

subscribeToPageTimerResponse(): void {
  this.onlineTimeSub = this.timeService.onEntryOnlinePageTimerResponse()
    .subscribe((currentDuration) => {
      console.log(`----> current Online time : ${currentDuration}`);
      this.onlineTime = currentDuration;
      this.minutes = this.getMinute(this.onlineTime);
      this.seconds = this.getSeconds(this.onlineTime);
      this.timeString = `${this.minutes <= 0 ? ' ' : (this.minutes + '  min ')} ${this.seconds} sec`;
      if (this.onlineTime <= 0 ) {
        this.timeService.entryPageTimerStopped();
      }
    }, (error) => { console.log(` PageTimer Stopped Error => ${error}`); });
  }

  subscribeToNewCategory() {
    this.subscriptions.push(
      this.quizEventService.onStartOfNewCategory()
        .subscribe((category) => {
          console.log(`A new category has been started : ${JSON.stringify(category)}`);
          this.quizService.currentCategory = category;
          this.fadeOut();
        })
    );
  }

  ngOnDestroy(): void {
    this.destroyInitPageSettings();
  }
}
