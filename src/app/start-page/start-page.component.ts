import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from '../service/quiz.service';
import {QuizEventService} from '../service/quiz-pane.service';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {Router} from '@angular/router';
import {PageService} from '../service/page.service';
import {EventSocketService} from "../service/event-socket.service";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit, OnDestroy {

  username: string;
  teamName: string;

  private _animator: AnimationBuilder;

  constructor(
                private eventService: EventSocketService,
                private pageService: PageService,
                private _elementRef: ElementRef,
               private router: Router,
               animationService: AnimationService,
               private quizEvents: QuizEventService,
               private quizService: QuizService,
  ) {
    this._animator = animationService.builder();
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
    this.quizService.teamName = this.teamName;
    this.quizService.username = this.username;
    this.quizEvents.userDetailsTaken({
      username: this.username,
      team: this.teamName
    });
    this.pageService.initUserDetails(this.username, this.teamName);
    console.log(`START Quix Service - team: ${this.teamName}   - username: ${this.username}`);
    this.fadeOut('fadeOutDown')
      .then(() => {
      this.router.navigate(['istart']);
      })
      .catch(error => {
        console.log(`StartPage Error Nav Error - ${error}`);
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
