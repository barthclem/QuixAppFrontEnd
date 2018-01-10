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
              private timeService: TimeService,
              private animationService: AnimationService,
              private _elementRef: ElementRef,
              private router: Router) {
    super();
    this.subscribeToNewCategory();
    this.subscribeToUsersTurn();
    if (this.timeService.endOfACategory) {
      this.endCategoryPageEnabled = true;
      this.initiateEndOfCatPage();
      this.initializeEndOfCategory();
    } else {
      this.initiateNewCatPage();
    }
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
          if (category.stageName) {
            this.endCategoryPageEnabled = false;
            this.quizService.currentCategory = category;
            this.categoryName = category.stageName;
            this.numberOfRounds = category.noOfRounds;
            this.teams = category.teams;
          }
        })
    );
  }

  initializeEndOfCategory() {
    const myTeam = this.quizResultService.getMyTeam();
    this.teamTotalScore = myTeam.totalScore;
    this.teamPosition = myTeam.position;
    const allTeams = this.quizResultService.getAllTeamList();
    this.teamScoresList = allTeams.map(team => ({
      teamPosition: team.position,
      teamTotalScore: team.totalScore,
      teamName: team.name
    }));
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
            this.router.navigate(['choose']);
          }
        })
    );
  }

  initiateNewCatPage (): void {
    this.pageService.enableSideBarsDisplay(true);
    this.pageService.setPageTitle('New Category');
  }

  initiateEndOfCatPage (): void {
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
