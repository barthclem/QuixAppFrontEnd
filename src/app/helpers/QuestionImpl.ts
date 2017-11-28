import {Question} from './question';
/**
 * Created by barthclem on 11/13/17.
 */
export class QuestionImpl implements Question {

  private _category: string;
  private _questionText: string;
  private _options: string[];
  private _id: number;
  private _type: number;
  private _title: string;
  private _img: string;
  private _answers: string [];
  constructor() {}

  // constructor(private _id: number, private _type: number, private _title: string,
  // private _img: string, private _answers: string []) {
  //
  // }

  get options(): string[] {
    return this._options;
  }

  set options(value: string[]) {
    this._options = value;
  }
  get questionText(): string {
    return this._questionText;
  }

  set questionText(value: string) {
    this._questionText = value;
  }
  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get answers(): string[] {
    return this._answers;
  }

  set answers(value: string[]) {
    this._answers = value;
  }
  get img(): string {
    return this._img;
  }

  set img(value: string) {
    this._img = value;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
