import {UserInterface} from './userDetails';
/**
 * Created by barthclem on 11/14/17.
 */
export class UserImpl implements  UserInterface {

  private _username: string;
  private _team: string;

  get team(): string {
    return this._team;
  }

  set team(value: string) {
    this._team = value;
  }
  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

}
