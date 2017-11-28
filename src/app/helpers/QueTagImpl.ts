import {QueTag} from './QueTag';
import {QuestionTag} from './questionTag';
/**
 * Created by barthclem on 11/21/17.
 */
export class QueTagImpl implements  QueTag{
  get questionTags(): QuestionTag[] {
    return this._questionTags;
  }

  set questionTags(value: QuestionTag[]) {
    this._questionTags = value;
  }
  get team(): string {
    return this._team;
  }

  set team(value: string) {
    this._team = value;
  }
  private _team: string;
  private _questionTags: QuestionTag[];

}
