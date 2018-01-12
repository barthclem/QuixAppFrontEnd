import {Question} from './question';
/**
 * Created by barthclem on 1/12/18.
 */
export interface  QuestionBody {
  question: Question;
  teamName: string;
  currentRound: number;
}
