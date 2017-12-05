import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../service/time.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Unsubscriber} from '../service/Unsubscriber';
import {AnimationService, AnimationBuilder} from "css-animator";

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
    private timeService: TimeService,
    private router: Router,
    private animationService: AnimationService,
    private _elementRef: ElementRef
  ) {
    super();
    this.subscribeToPageTimerStopped();
    this._animator = this.animationService.builder();
    console.log(`The time Service onlineTimer Started => ${this.timeService.onlineTimerStarted}`);
        if (this.timeService.onlineTimerStarted) {
    this.subscribeToPageTimerResponse();
    }
  }

  ngOnInit() {
    console.log(`Init this guy mehn --- I mean for real (-_-)`);
    this.fadeInAnimation();
    if (this.timeService.onlineTimerStarted) {
      this.startLocalTimer(this.onlineTime);
      this.onlineTimeSub.unsubscribe();
    } else {
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
      .then(() => { this.router.navigate(['category']);  console.log('Timer Page is Out for now'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }


  startTimer () {
    this.timeService.entryPageTimerStarted(1);
    this.timeService.localTimerStarted = true;
    this.timeSub = this.timeService.minuteTimer(1)
      .subscribe(time => {
          this.minutes = this.getMinute(time);
          this.seconds = this.getSeconds(time);
          this.timeString = `${this.minutes <= 0 ? ' ' : (this.minutes + '  min ')} ${this.seconds} sec`;
        }, (error) => {console.log( `time subscriptions : ${error}`); },
        () => {
          console.log(`End of Entry Page Timer`);
          this.timeService.entryPageTimerStopped(); } );
  }

  startLocalTimer ( currentTime: number) {
    this.timeSub = this.timeService.minuteTimer(currentTime, true)
      .subscribe(time => {
          this.minutes = this.getMinute(time);
          this.seconds = this.getSeconds(time);
          this.timeString = `${this.minutes <= 0 ? ' ' : (this.minutes + '  min ')} ${this.seconds} sec`;
        }, (error) => {console.log( `time subscriptions : ${error}`); },
        () => {
          console.log(`End of Entry Page Timer`);
          this.timeService.entryPageTimerStopped(); } );
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
          this.timeSub.unsubscribe();
          this.fadeOut();
          this.timeService.startPageEnd();
        }, (error) => { console.log(` PageTimer Stopped Error => ${error}`); })
    );
  }

subscribeToPageTimerResponse() {
  this.onlineTimeSub = this.timeService.onEntryOnlinePageTimerResponse()
    .subscribe((currentDuration) => {
      console.log(`current Online time : ${currentDuration}`);
      this.onlineTime = currentDuration;
    }, (error) => { console.log(` PageTimer Stopped Error => ${error}`); });
  }

  ngOnDestroy(): void {
  }
}
