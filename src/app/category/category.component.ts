import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from '../service/quiz.service';
import {Category} from '../helpers/Category';
import {QuizEventService} from '../service/quiz-pane.service';
import {Unsubscriber} from '../service/Unsubscriber';
import {Router} from '@angular/router';
import {AnimationService, AnimationBuilder} from 'css-animator';
import {QuizResultService} from '../service/quiz-result.service';
import {TimeService} from '../service/time.service';
import {PageService} from '../service/page.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends Unsubscriber implements OnInit, OnDestroy {

  public categoryName = '';
  public numberOfRounds = 0;
  public teams: string [] = [];
  private category: Category;

  private _animator: AnimationBuilder;

  constructor(
              private pageService: PageService,
              private quizService: QuizService,
              private quizEventService: QuizEventService,
              private animationService: AnimationService,
              private _elementRef: ElementRef,
              private router: Router) {
    super();
    this.initiateNewCatPage();
    this.initiateNewCategory();
    this.subscribeToUsersTurn();
    this._animator = this.animationService.builder();
  }

  ngOnInit() {
    this.fadeInAnimation();
  }

  fadeInAnimation() {
    this._animator
      .setType('fadeInRight')
      .setDelay(100)
      .setDuration(700)
      .show(this._elementRef.nativeElement)
      .then(() => {
        console.log('Page is loaded');
      })
      .catch(error => {
        console.log(`fade In - Error using Animation => ${error}`);
      });

  }

  fadeOut() {
    this._animator
      .setType('fadeOutLeft')
      .setDelay(100)
      .setDuration(700)
      .hide(this._elementRef.nativeElement)
      .then(() => {
        console.log('Category Page is loaded');
        this.router.navigate(['choose']);
      })
      .catch(error => {
        console.log(`fade In - Error using Animation => ${error}`);
      });

  }

  initiateNewCategory(): void {
    const category = this.quizService.currentCategory;
    this.categoryName = category.stageName;
    this.numberOfRounds = category.noOfRounds;
    this.teams = category.teams;
  }

  subscribeToUsersTurn() {

    let usersNotTurned = true;
    console.log(`Considered Users Turn Subscribe`);
    this.subscriptions.push(
      this.quizEventService.onUsersTurnToPickQuestion()
        .subscribe(queTag => {
          console.log(`QueTag => ${JSON.stringify(queTag)}`);
          if (queTag.team && this.quizService.teamName) {
            usersNotTurned = false;
            console.log(`Active Team => ${JSON.stringify(queTag.team)}`);
            this.quizService.activeTeam = queTag.team;
            this.quizService.teamTurn = this.quizService.teamName === queTag.team;
            console.log(`Active Team => ${queTag.team}; My Team => ${this.quizService.teamName};
             Team Turn => ${this.quizService.teamTurn}`);
            this.fadeOut();
          }
        })
    );
  }

  initiateNewCatPage (): void {
    this.pageService.enableSideBarsDisplay(true);
    this.pageService.setPageTitle('New Category');
  }

  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy() {
    this.destroyInitPageSettings();
  }
}
