import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../service/quiz.service';
import {Subscriber} from 'rxjs';
import {QuizEventService} from "../../service/quiz-pane.service";
import {Unsubscriber} from "../../service/Unsubscriber";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent extends  Unsubscriber  implements OnInit {

  public member: string;
  public teamName: string;
  public score: number;
  public position: number;
  public status: boolean;

  constructor(
    private quizService: QuizService,
    private quizEventService: QuizEventService
  ) {
    super();
    this.member = this.quizService.username;
    this.teamName = this.quizService.teamName;
    this.status = true;
    this.position = 1;
    this.score = 0;
    this.subscribeToTeamDetailsUpdate();
  }

  ngOnInit() {
  }

  subscribeToTeamDetailsUpdate() {
    this.subscriptions.push(
      this.quizEventService.onUpdateMyTeamScore()
        .subscribe( team => {
          console.log(`My Team Score Update : ${JSON.stringify(team)}`);
          console.log(`status : ${team.qualified}  position : ${team.position} totalScore : ${team.totalScore}`);
          this.status = team.qualified;
          this.position = team.position;
          this.score = team.totalScore;
        })
    );
  }


}
