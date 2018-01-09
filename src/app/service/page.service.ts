import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class PageService {

  private _username: string;
  private _team: string;
  private _pageTitle: Subject<string>;
  private _displayUserInfo: Subject<boolean>;
  private _displayTeamMembers: Subject<boolean>;
  private _displayTeamScore: Subject<boolean>;
  private _displaySideBars: Subject<boolean>;
  private _quixMainApp: Subject<boolean>;


  constructor() {
    this._displayUserInfo = new Subject();
    this._displayTeamMembers = new Subject();
    this._displayTeamScore = new Subject();
    this._displaySideBars = new Subject();
    this._pageTitle = new Subject();
    this._quixMainApp = new Subject();
  }

  public isQuixMainApp(state: boolean): void {
    this.quixMainApp.next(state);
  }

  public enableTeamMembersDisplay(decision: boolean): void {
    this.displayTeamMembers.next(decision);
  }

  public enableTeamScoreDisplay(decision: boolean): void {
    this.displayTeamScore.next(decision);
  }

  public enableSideBarsDisplay(decision: boolean): void {
    this.displaySideBars.next(decision);
  }

  public setPageTitle(title: string): void {
    this._pageTitle.next(title);
  }

  get displaySideBars(): Subject<boolean> {
    return this._displaySideBars;
  }

  get displayTeamScore(): Subject<boolean> {
    return this._displayTeamScore;
  }

  get displayTeamMembers(): Subject<boolean> {
    return this._displayTeamMembers;
  }

  get pageTitle(): Subject<string> {
    return this._pageTitle;
  }

  get quixMainApp(): Subject<boolean> {
    return this._quixMainApp;
  }

  get team(): string {
    return this._team;
  }

  set team(value: string) {
    this._team = value;
    this.displayUserInfo.next(true);
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get displayUserInfo(): Subject<boolean> {
    return this._displayUserInfo;
  }

  set displayUserInfo(value: Subject<boolean>) {
    this._displayUserInfo = value;
  }

  public destroyPageView () {
    this.isQuixMainApp(false);
    this.enableTeamMembersDisplay(false);
    this.enableSideBarsDisplay(false);
    this.enableTeamScoreDisplay(false);
  }

}
