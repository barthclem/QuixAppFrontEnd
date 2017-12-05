import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NavService {

  private _endOfCategory = new EventEmitter<void>();
  private _scoreUpdated = new EventEmitter<void>();
  private _newCategory = new EventEmitter<void>();
  private _changeOfStates = new EventEmitter<void>();

  constructor() { }

  public onEndOfCategory () {
    return this._endOfCategory;
  }

  private onScoreUpdated () {
    return this._scoreUpdated;
  }

  private onNewCategory () {
    return this._newCategory;
  }

  public onChangeOfState () {
    return this._changeOfStates;
  }

}
