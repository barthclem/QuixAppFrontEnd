import { Injectable } from '@angular/core';
import {QuestionTag} from '../../../helpers/questionTag';
import {QuestioinTagImpl} from '../../../helpers/QuestionTagImpl';
import {Observable} from 'rxjs';
import {observable} from 'rxjs/symbol/observable';

@Injectable()
export class QChooserService {

  private  _questionTag: QuestionTag [];
  constructor() {
     this._questionTag = [
       new QuestioinTagImpl(1, true),
       new QuestioinTagImpl(2, true),
       new QuestioinTagImpl(3, true),
       new QuestioinTagImpl(4, true),
       new QuestioinTagImpl(5, true),
       new QuestioinTagImpl(6, true),
       new QuestioinTagImpl(7, true),
       new QuestioinTagImpl(8, true),
       new QuestioinTagImpl(9, true),
       new QuestioinTagImpl(10, true),
       new QuestioinTagImpl(11, true),
       new QuestioinTagImpl(12, true)
     ];
  }

  get questionTag(): QuestionTag[] {
    return this._questionTag;
  }

  set questionTag(value: QuestionTag[]) {
    this._questionTag = value;
  }


  getQuestionTags(): Observable<QuestionTag[]> {
    return Observable.of(this.questionTag);
  }

  updateQuestionTag(questionNumber: number) {
    const targetTag = this.questionTag.find((tag) => {
        return tag.questionNumber === questionNumber;
    });
    if (targetTag) { targetTag.available = false; }
  }

  getAvailableQuestions () {
    return Observable.of(this.questionTag.filter(tag => tag.available));
  }
}
