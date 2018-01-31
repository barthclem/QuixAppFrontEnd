import { Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {UserInterface} from '../helpers/userDetails';
import {Category} from '../helpers/Category';
import {CategoryImpl} from '../helpers/CategoryImpl';
import {Question} from '../helpers/question';
import {QuestionImpl} from '../helpers/QuestionImpl';
import {QueTag} from '../helpers/QueTag';
import {QueTagImpl} from '../helpers/QueTagImpl';
import {QuestionAttempted} from '../helpers/QuestionAttempted';
import {Team} from '../helpers/Team';
import {TeamImpl} from '../helpers/TeamImpl';
import {QuestionBody} from "../helpers/QuestionBody";

@Injectable()
export class QuizEventService {

  private _questionIsSelected = new Subject<number>();
  private _questionIsAnswered = new Subject<QuestionAttempted>();
  private _bonusIsAttempted = new Subject<QuestionAttempted>();
  private _questionIsLoaded = new Subject<QuestionBody>();
  private _answerIsLoaded = new Subject<any>();
  private _bonusIsLoaded = new Subject<string>();
  private _updateQuestionTag = new Subject<number>();
  private _teamScoresUpdate = new Subject<Team []>();
  private _myTeamScoreUpdate = new BehaviorSubject<Team>(new TeamImpl('rand'));

  private  _timeToPickQuestion = new Subject<QueTag>();
  private _teamMateHasPickedQuestion = new Subject<any>();
  private _teamHasPickedQuestion = new Subject<string>();
  private _startNewCategory = new Subject<Category>();
  private _endOfCategory = new Subject<void>();
  private _endOfQuixCompetition = new Subject<void>();
  private _userDetailsTaken = new Subject<UserInterface>();


  constructor() { }

  get startNewCategory(): Subject<Category> {
    return this._startNewCategory;
  }

  set startNewCategory(value: Subject<Category>) {
    this._startNewCategory = value;
  }

  public userDetailsTaken (user: UserInterface) {
    console.log(`Sincere Frustra`);
    this._userDetailsTaken.next(user);
  }

  public questionSelected( questionNumber: number): void {
    this._questionIsSelected.next(questionNumber);
  }
  public questionAnswered( optionPicked: QuestionAttempted) {
    this._questionIsAnswered.next(optionPicked);
  }

  public updateQuestiontag (questionNumber: number) {
    this._updateQuestionTag.next(questionNumber);
  }

  public fireUpdateAllTeamsScores (teams: Team []) {
    this._teamScoresUpdate.next(teams);
  }

  public fireUpdateMyTeamsScore (team: Team) {
    this._myTeamScoreUpdate.next(team);
  }

  public fireQuestionLoadedEvent (questionBody: QuestionBody) {
   this._questionIsLoaded.next(questionBody);
  }

  public fireAnswerLoadedEvent (result: any) {
    this._answerIsLoaded.next(result);
  }

  public bonusAttempted ( optionPicked: QuestionAttempted) {
    this._bonusIsAttempted.next(optionPicked);
  }

  public fireBonusLoadedEvent (team: string) {
    this._bonusIsLoaded.next(team);
  }

  public fireEndOfQuixCompetition () {
     this._endOfQuixCompetition.next();
  }

  public fireNewCategoryEvent (category: Category) {
    this.startNewCategory.next(category);
  }

  public fireEndOfCategoryEvent () {
    this._endOfCategory.next();
  }

  public fireUserTurnToPickQuestionEvent (queTag: QueTag) {
     this._timeToPickQuestion.next(queTag);
  }

  public fireTeamMateHasPickedAQuestion (pickDetails: any) {
    this._teamMateHasPickedQuestion.next(pickDetails);
  }

   public fireTeamHasPickedAQuestion (pickMessage: string) {
    this._teamMateHasPickedQuestion.next(pickMessage);
  }

  public onUpdateAllTeamScores () {
    return this._teamScoresUpdate;
  }

  public onUpdateMyTeamScore () {
    return this._myTeamScoreUpdate;
  }

  public onQuestionSelected() {
    return this._questionIsSelected;
  }
  public onQuestionAnswered() {
    return this._questionIsAnswered;
  }

  public onQuestionLoaded() {
    return this._questionIsLoaded;
  }

  public onAnsweredLoaded () {
    return this._answerIsLoaded;
  }

  public onBonusAttempted () {
    return this._bonusIsAttempted;
  }

  public onBonusLoaded () {
    return this._bonusIsLoaded;
  }

  public onEndOfQuiz () {
    return this._endOfQuixCompetition;
  }

  public onStartOfNewCategory () {
    return this._startNewCategory;
  }

  public onEndOfCategory () {
    return this._endOfCategory;
  }

  public onUsersTurnToPickQuestion () {
    return this._timeToPickQuestion;
  }

  public onUserDetialsTaken () {
    return this._userDetailsTaken;
  }

  public onTeamPickingQuestion () {
    return this._teamHasPickedQuestion;
  }

  public onTeamMatePickingQuestion () {
    return this._teamMateHasPickedQuestion;
  }

  public onQuestionTagUpdate () {
    return this._updateQuestionTag;
  }

}
