import { Component, OnInit } from '@angular/core';
import {QuizResultService} from '../service/quiz-result.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  public teamList: any;

  constructor(private quizResultService: QuizResultService) {
    this.teamList = quizResultService.teamSub;
  }

  ngOnInit() {
  }

}
