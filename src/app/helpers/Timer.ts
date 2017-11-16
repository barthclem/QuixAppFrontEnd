import {TimerInterface} from './timeInterface';
/**
 * Created by barthclem on 11/13/17.
 */
export class Time implements TimerInterface {
  private _seconds: number;
  private _minutes: number;

  get seconds(): number {
    return this._seconds;
  }

  set seconds(value: number) {
    this._seconds = value;
  }

  get minutes(): number {
    return this._minutes;
  }

  set minutes(value: number) {
    this._minutes = value;
  }

}
