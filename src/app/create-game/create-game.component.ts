import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {EventSocketService} from '../service/event-socket.service';
import {PageService} from '../service/page.service';
import {Router} from '@angular/router';
import {QuizEventService} from '../service/quiz-pane.service';
import {QuizService} from '../service/quiz.service';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit, OnDestroy {

  gameName: string;
  teamList: any [];
  gameNotCreated: boolean;
  gameLink: string;

  private _animator: AnimationBuilder;

  constructor(
    private eventService: EventSocketService,
    private pageService: PageService,
    private _elementRef: ElementRef,
    private router: Router,
    animationService: AnimationService,
    private quizEvents: QuizEventService,
    private quizService: QuizService,
    private httpClient: HttpClient
  ) {
    this._animator = animationService.builder();
    this.gameNotCreated = true;
    this.initPageSettings();
  }

  ngOnInit() {
    this.fadeIn('fadeInUp');
  }

  fadeIn( fadeDir: string ) {
    this._animator
      .setType(fadeDir)
      .setDelay(100)
      .setDuration(700)
      .show(this._elementRef.nativeElement)
      .then(() => { console.log('Page is loaded');
      })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });
  }

  fadeOut( fadeDir: string ) {
    return this._animator
      .setType(fadeDir)
      .setDelay(350)
      .setDuration(600)
      .hide(this._elementRef.nativeElement);
  }

  logIn() {
    const teams = this.teamList.map(teamI => teamI.value);

    this.httpClient.post(environment.api_url_secure, {
      name: this.gameName,
      teamList: teams
    })
      .subscribe( (res: any) => {
        console.log(`res -- ${JSON.stringify(res)}`);
       this.gameNotCreated = false;
       this.gameLink = res.data.link;
      }, err => {
        console.log(`error -- ${JSON.stringify(err)}`);

      });
  }

  initPageSettings () {
    this.pageService.setPageTitle('Start');
  }

  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy(): void {
    this.destroyInitPageSettings();
  }

}
