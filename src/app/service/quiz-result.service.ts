import { Injectable } from '@angular/core';
import {Team} from '../helpers/Team';
import {QuizService} from './quiz.service';
import {QuizEventService} from './quiz-pane.service';
import {ChatService} from './chat.service';
import {Unsubscriber} from './Unsubscriber';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable()
export class QuizResultService extends Unsubscriber {

  private _allTeams: Team [];
  private _myTeam: Team;
  private teamName: string;

  private _teamSub: BehaviorSubject<any []>;

  constructor(
    private quizService: QuizService,
    private quizEventService: QuizEventService,
    private chatService: ChatService
  ) {
    super();
    this.teamName = quizService.teamName;
    this._allTeams = [];
    this._teamSub = new BehaviorSubject<any []>([]);
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
    console.log(`Updated Team List => ${JSON.stringify(teams)}`);
    teams.forEach( team => {
      console.log(`=> Start browsing the list of teams`);
      const foundTeam = this._allTeams.find( t => t.name === team.name);
      if (foundTeam) {
         const foundTeamIndex = this._allTeams.indexOf(foundTeam);
         this._allTeams[foundTeamIndex] = team;
         if (foundTeam.name === this.teamName) {
           console.log(`=> My Team is => ${JSON.stringify(team)}`);
           this._myTeam = team;
           this.quizEventService.fireUpdateMyTeamsScore(team);
         }
      } else {
        this._allTeams.push(team);
      }
    });
   this._allTeams.sort((teamA, teamB) => teamA.position - teamB.position);
    this.teamSub.next(this._allTeams);
  }

  public getAllTeamList () {
    return this._allTeams;
  }

  public getMyTeam () {
    return this._myTeam;
  }

  get teamSub(): BehaviorSubject<any []> {
    return this._teamSub;
  }


}
