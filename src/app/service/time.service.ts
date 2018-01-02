import {Injectable} from '@angular/core';
import {scrollTo} from '../helpers/scroll';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {Time} from '../helpers/Timer';


@Injectable()
export class TimeService {

  private _timeForQuestionExpired = new Subject<void>();
  private _timeForQuestionSelectionExpired = new Subject<void>();
  private _timeForBonusQuestionExpired = new Subject<void>();
  private _endOfNewCategoryReached = new Subject<void>();

  private _teamTurn = new Subject<void>();
  private _teamBonus = new Subject<void>();
  private _questionAlert = new Subject<void>();

  private _endOfStartPage = new Subject<void>();
  private _entryPageTimerStopped = new Subject<void>();
  private _entryPageTimerStarted = new Subject<number>();
  private _entryPageOnlineTimerResponse = new BehaviorSubject<number>(20000);
  private _startBreakTime = new Subject<void>();

  private _scrollDuration = 100;

  private duration = new BehaviorSubject<Time>(new Time());
  private currentTime = new Time();

  private _onlineTimerStarted = false;
  private _onlineTimerStopped = false;
  private _localTimerStarted = false;
  private _durationNumber: number;
  private onlineStarterTime: number;

  private _endOfACategory: boolean;

  constructor() {
  }

  get localTimerStarted(): boolean {
    return this._localTimerStarted;
  }

  set localTimerStarted(value: boolean) {
    this._localTimerStarted = value;
  }

  get onlineTimerStopped(): boolean {
    return this._onlineTimerStopped;
  }

  set onlineTimerStopped(value: boolean) {
    this._onlineTimerStopped = value;
  }

  get onlineTimerStarted(): boolean {
    return this._onlineTimerStarted;
  }

  set onlineTimerStarted(value: boolean) {
    this._onlineTimerStarted = value;
  }

  get durationNumber(): number {
    return this._durationNumber;
  }

  set durationNumber(value: number) {
    this._durationNumber = value;
  }

  setOnlineTimerStatus (value: boolean) {
     console.log(`Checked -> The status of online timer : ${value}`);
     this.onlineTimerStarted = value;
  }

  public timeForQuestionExpired() {
    this._timeForQuestionExpired.next();
  }

  public timeForBonusExpired() {
    this._timeForBonusQuestionExpired.next();
  }

  public timeForQuestionSelectionExpired() {
    this._timeForQuestionSelectionExpired.next();
  }

  public interBreakFinished() {
    this._endOfNewCategoryReached.next();
  }

  public teamTurn() {
    this._teamTurn.next();
  }

  public teamBonus() {
    this._teamBonus.next();
  }

  public questionAlert() {
    this._questionAlert.next();
  }

  public entryPageTimerStopped () {
    this._entryPageTimerStopped.next();
  }

  public entryPageTimerStarted (duration: number) {
    this._entryPageTimerStarted.next(duration);
  }

  public fireOnlinePageTimerEvent (duration: number) {
    this._entryPageOnlineTimerResponse.next(duration);
    this.setOnlineTimerStatus(true);
  }

  public startPageEnd() {
    scrollTo(document.body, 0, this._scrollDuration)
      .then(() => {
        this._endOfStartPage.next();
      });
  }

  public onTimeForQuestionExpired() {
    return this._timeForQuestionExpired;
  }

  public onTimeForBonusExpired() {
    return this._timeForBonusQuestionExpired;
  }

  public onTimeForQuestionSelectionExpired() {
    return this._timeForQuestionSelectionExpired;
  }

  public onInterBreakFinished() {
    return this._endOfNewCategoryReached;
  }

  public onTeamTurn() {
    return this._teamTurn;
  }

  public onTeamBonus() {
    return this._teamBonus;
  }

  public onQuestionAlert() {
    return this._questionAlert;
  }

  public onStartPageEnd() {
    return this._endOfStartPage;
  }

  public onEntryPageTimerStopped () {
   return this._entryPageTimerStopped;
  }

  public onEntryPageTimerStarted () {
   return this._entryPageTimerStarted;
  }

public onEntryOnlinePageTimerResponse () {
   return this._entryPageOnlineTimerResponse;
  }


  /*
  This minute Timer is meant for the start page
   */
  public minuteTimer (time: number, enableSec?: boolean) {
    let dueTime = enableSec ? time : ((time ? time : 0) * 60);

    return  Observable.timer(0, 1000)
      .map(() => dueTime--)
      .takeWhile(remaining => remaining >= 0);
  }

  /*
  *This is the general countdown timer for the system
  * @params {min} - the minute
  * @params {sec} - the seconds
   */
  public countdownTimer (min: number, sec: number, stopCondition: BehaviorSubject<boolean>) {

    let dueTime = ((min > 0 ? min : 0) * 60) + sec;
    return  Observable.timer(0, 1000)
      .map(() => dueTime--)
      .do((time) => { this.setTime(time); })
      .takeWhile(remaining => (remaining >= 0 && !stopCondition.getValue() ));
  }
  getMinute ( time: number) {
    return Math.floor(time / 60);
  }

  getSeconds ( time: number) {
    return time % 60;
  }

  getTimer () {
    return new Time();
  }

  get endOfACategory(): boolean {
    return this._endOfACategory;
  }

  set endOfACategory(value: boolean) {
    this._endOfACategory = value;
  }


  setTime(time: number) {
    this.currentTime.minutes = this.getMinute(time);
    this.currentTime.seconds = this.getSeconds(time);
    this.duration.next(this.currentTime);
  }

  getRemainingDuration () {
    return this.duration;
  }
}
