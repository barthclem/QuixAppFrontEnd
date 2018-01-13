import { Injectable } from '@angular/core';
import {Question} from '../helpers/question';
import {QuestionImpl} from '../helpers/QuestionImpl';
import {BehaviorSubject, Observable} from 'rxjs';
import {Category} from '../helpers/Category';
import {QuestionType} from '../helpers/QuestionType';
import {NotificationBody} from "../helpers/NotificationBody";
import {NotificationType} from "../helpers/NotificationType";
import {NotificationMessage} from "../helpers/NotificationMessage";

@Injectable()
export class QuizService {
  private demoQuestions: Question[];
  private _currentQuestion: Question;
  private _currentRound: number;
  private _message = new BehaviorSubject<NotificationBody>({notificationType: NotificationType.GENERAL, message: NotificationMessage.WELCOME_MESSAGE});
  private _currentCategory: Category;

  private _teamName: string;
  private _username: string;
  private _teamTurn: boolean;
  private _activeTeam: string;

  constructor() {
    this.demoQuestions = [new QuestionImpl()];
  }

  get activeTeam(): string {
    return this._activeTeam;
  }

  set activeTeam(value: string) {
    this._activeTeam = value;
  }

  get teamTurn(): boolean {
    return this._teamTurn;
  }

  set teamTurn(value: boolean) {
    this._teamTurn = value;
  }

  get teamName(): string {
    return this._teamName;
  }

  set teamName(value: string) {
    this._teamName = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get currentQuestion(): Question {
    return this._currentQuestion;
  }

  set currentQuestion(value: Question) {
    this._currentQuestion = value;
  }

  getAllQuestions (): Observable<Question []> {
    return Observable.of(this.demoQuestions);
  }

  getAQuestion (): Question {
    return {
      id: 1,
        category: 'General',
      type: QuestionType.TEXT,
      questionText: 'Who is Enitan?',
      options: ['Oba of Benin', 'A white man', 'Prince of Wales', 'I don\'t know'],
      answer: 'Prince of Wales'
    };
  }
  getQuestion (questionNumber: number): Question {
    return this.demoQuestions.find( question => question.id === questionNumber);
  }

  answerIsCorrect (questionId: number, answer: string) {
    return Math.floor(Math.random() * 3) === 0;
  }

  setMessage( alert: NotificationBody) {
    this._message.next(alert);
  }

  getMessage(): BehaviorSubject<NotificationBody> {
    return this._message;
  }

  get currentCategory(): Category {
    return this._currentCategory;
  }

  set currentCategory(value: Category) {
    this._currentCategory = value;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  set currentRound(value: number) {
    this._currentRound = value;
  }

}
