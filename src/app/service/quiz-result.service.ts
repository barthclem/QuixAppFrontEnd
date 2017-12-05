import { Injectable } from '@angular/core';
import {Team} from '../helpers/Team';
import {QuizService} from './quiz.service';
import {QuizEventService} from './quiz-pane.service';
import {ChatService} from './chat.service';
import {Unsubscriber} from './Unsubscriber';

@Injectable()
export class QuizResultService extends Unsubscriber{

  private _allTeams: Team [];
  private _myTeam: Team;
  private teamName: string;

  constructor(
    private quizService: QuizService,
    private quizEventService: QuizEventService,
    private chatService: ChatService
  ) {
    super();
    this.teamName = quizService.teamName;
    this._allTeams = [];
    this.subscribeToJoinResponse();
    }

  subscribeToJoinResponse () {
    this.subscriptions.push(
      this.chatService.onJoinEventResponse()
        .subscribe(data => {
          this.teamName = data.team;
        })
    );
  }

  public updateTeamList ( teams: Team []) {
    teams.forEach( team => {
      console.log(`Start browsing the list of teams`);
      const foundTeam = this._allTeams.find( t => t.name === team.name);
      console.log(`My Team Name: ${this.teamName}  Team found : ${JSON.stringify(foundTeam)}`);
      if (foundTeam) {
         const foundTeamIndex = this._allTeams.indexOf(foundTeam);
         this._allTeams[foundTeamIndex] = team;
         if (foundTeam.name === this.teamName) {
           console.log(`My Team is => ${JSON.stringify(foundTeam)}`);
           this._myTeam = foundTeam;
           this.quizEventService.fireUpdateMyTeamsScore(foundTeam);
         }
      } else {
        this._allTeams.push(team);
      }
    });
  }

  public getAllTeamList () {
    return this._allTeams;
  }

  public getMyTeam () {
    return this._myTeam;
  }


}
