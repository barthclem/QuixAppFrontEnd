import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../helpers/Category';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {TimeService} from '../service/time.service';
import {QuizEventService} from '../service/quiz-pane.service';
import {QuizService} from '../service/quiz.service';
import {PageService} from '../service/page.service';
import {QuizResultService} from '../service/quiz-result.service';
import {Router} from '@angular/router';
import {Unsubscriber} from '../service/Unsubscriber';

@Component({
  selector: 'app-e-category',
  templateUrl: './e-category.component.html',
  styleUrls: ['./e-category.component.css']
})
export class ECategoryComponent  extends Unsubscriber implements OnInit, OnDestroy {

  public endCategoryPageEnabled: boolean;
  public teamTotalScore: number;
  public teamPosition: number;
  public teamScoresList: any;
  public categoryName = '';
  public numberOfRounds = 0;
  public teams: string [] = [];
  private category: Category;

  private _animator: AnimationBuilder;
  constructor(
    private pageService: PageService,
    private quizService: QuizService,
    private quizEventService: QuizEventService,
    private quizResultService: QuizResultService,
    private animationService: AnimationService,
    private _elementRef: ElementRef,
    private router: Router
  ) {
    super();
    this.initiateEndOfCatPage();
    this.initializeEndOfCategory();
    this.subscribeToNewCategory();
    this.subscribeToEndOfQuix();
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
        this.router.navigate(['s-category']);
        console.log('Category Page is loaded');
      })
      .catch(error => {
        console.log(`fade In - Error using Animation => ${error}`);
      });

  }

  subscribeToNewCategory() {
    this.subscriptions.push(
      this.quizEventService.onStartOfNewCategory()
        .subscribe((category) => {
          console.log(`A new category has been started : ${JSON.stringify(category)}`);
          this.quizService.currentCategory = category;
          this.fadeOut();
        })
        );
  }

  subscribeToEndOfQuix() {
    this.subscriptions.push(
      this.quizEventService.onEndOfQuiz()
        .subscribe(() => {
          this.fadeOut();
          this.router.navigate(['end']);
        })
    );
  }

  initializeEndOfCategory() {
    const myTeam = this.quizResultService.getMyTeam();
    this.categoryName = this.quizService.currentCategory.stageName;
    this.teamTotalScore = myTeam.totalScore;
    this.teamPosition = myTeam.position;
    this.teamScoresList = this. quizResultService.teamSub;
  }

  initiateEndOfCatPage (): void {
    this.pageService.destroyPageView();
    this.pageService.enableTeamMembersDisplay(true);
    this.pageService.setPageTitle('Category Summary');
  }

  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy() {
    this.destroyInitPageSettings();
  }

}
