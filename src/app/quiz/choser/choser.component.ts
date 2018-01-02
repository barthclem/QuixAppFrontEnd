import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TimeService} from '../../service/time.service';
import {Router} from '@angular/router';
import {AnimationService, AnimationBuilder} from 'css-animator';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {TimerInterface} from '../../helpers/timeInterface';
import {QuestionTag} from '../../helpers/questionTag';
import {QChooserService} from './service/q-chooser.service';
import {QuizEventService} from '../../service/quiz-pane.service';
import {Unsubscriber} from '../../service/Unsubscriber';
import {QuizService} from '../../service/quiz.service';
import {PageService} from '../../service/page.service';

@Component({
  selector: 'app-choser',
  templateUrl: './choser.component.html',
  styleUrls: ['./choser.component.css']
})
export class ChoserComponent extends Unsubscriber implements OnInit, OnDestroy {

  private _animator: AnimationBuilder;
  private questionPicked = new BehaviorSubject(false);
  public time: TimerInterface;
  public questionTags: Observable<QuestionTag[]>;
  private availableQuestions: QuestionTag[];
  private availableQuestionSub: Subscription;
  public aTeamHasPickedQue: boolean;
  public pickedQueMessage: string;

  public teamTurn: boolean;
  public activeTeam: string;

  constructor(
    private pageService: PageService,
    private timeService: TimeService,
    private router: Router,
    private animationService: AnimationService,
    private _elementRef: ElementRef,
    private choserService: QChooserService,
    private quizEventService: QuizEventService,
    private quizService: QuizService) {
    super();
    this._animator = this.animationService.builder();
    console.log(`Chooser Component (-_-)`);
    this.subscribeToEndOfPickQuestionTime();
    this.subscribeToAvailableTags();
    this.subscribeToQuestionLoaded();
    this.questionTags = this.choserService.getQuestionTags();
    this.time = this.timeService.getTimer();
    this.teamTurn = this.quizService.teamTurn;
    this.activeTeam = this.quizService.teamName;

    this.initiatePage();
    if (!this.teamTurn) {
      this.subscribeToQuestionSelected();
      this.subscribeToTeamPickedQuestion();
    } else {
      this.subscribeToTeamMatePickedQuestion();
    }
  }

  ngOnInit() {
    this.fadeInAnimation();
    if (this.teamTurn) {
      this.startCountDownTimer();
    }

  }

  subscribeToEndOfPickQuestionTime () {

  }

  fadeInAnimation () {
    this._animator
      .setType('fadeInRight')
      .setDelay(100)
      .setDuration(700)
      .show(this._elementRef.nativeElement)
      .then(() => { console.log('Choser Page is loaded'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }

  startCountDownTimer() {
    console.log(`Question Picked? ${this.questionPicked}`);
    this.timeService.countdownTimer(0, 40, this.questionPicked)
      .subscribe((time) => {
          this.time.minutes = this.timeService.getMinute(time);
          this.time.seconds = this.timeService.getSeconds(time);
          console.log(`CountDown time Min: ${this.time.minutes} Sec: ${this.time.seconds}`);
        }, (error) => {console.log(` Choser Timer Error => ${error} `); },
        () => {
         if (!this.questionPicked.getValue()) {
           console.log(`Chose A Random Question`);
           this.selectAQuestion(this.chooseARandomQuestion());
         }
        });
  }

  fadeOut() {
    this._animator
      .setType('fadeOutLeft')
      .setDelay(100)
      .setDuration(700)
      .hide(this._elementRef.nativeElement)
      .then(() => { this.router.navigate(['quiz']); console.log('Left the Question Picking Page'); })
      .catch( error => { console.log(`fade Out - Error using Animation => ${error}`); });

  }

  navigateToQuiz() {
    this.router.navigate(['quiz']);
  }

  selectAQuestion ( questionNumber: number) {
    this.choserService.updateQuestionTag(questionNumber);
    this.questionPicked.next(true);
    this.quizEventService.questionSelected(questionNumber);
  }

  subscribeToQuestionLoaded () {
    this.subscriptions.push(
      this.quizEventService.onQuestionLoaded().subscribe(
        (question) => {
          if (question.category) {
            console.log(`CHOSER COMPONENT: Question downloaded from the net: ${JSON.stringify(question)}`);
            this.quizService.currentQuestion = question;
            this.fadeOut();
          }

        })
    );
  }



  subscribeToAvailableTags () {
    this.availableQuestionSub = this.choserService.getAvailableQuestions()
      .subscribe(availableQuestions => {
        console.log(`Available Questions Derma`);
        this.availableQuestions = availableQuestions; });
    this.subscriptions.push(this.availableQuestionSub);
  }

  subscribeToTeamPickedQuestion () {
    this.subscriptions.push(
      this.quizEventService.onTeamPickingQuestion().
        subscribe(pickedMessage => {
        console.log(`Another Team Picked Message : ${pickedMessage}`);
          if (pickedMessage !== '') {
            this.aTeamHasPickedQue = true;
            this.pickedQueMessage = pickedMessage;
            this.questionPicked.next(true);
            console.log(`Another Team : ${this.pickedQueMessage}`);
          }
      })
    );
  }

  subscribeToTeamMatePickedQuestion () {
    this.subscriptions.push(
      this.quizEventService.onTeamMatePickingQuestion()
        .subscribe(pickedDetail => {
          console.log(`TeamMate Picked Details : ${JSON.stringify(pickedDetail)}`);
          if ( pickedDetail.selectedNumber > -1) {
            this.questionPicked.next(true);
            this.aTeamHasPickedQue = true;
            this.choserService.updateQuestionTag(pickedDetail.selectedNumber);
            this.pickedQueMessage = `${pickedDetail.username} has picked ${pickedDetail.selectedNumber}`;
            console.log(`TeamMate : ${this.pickedQueMessage}`);
          }

        })
    );
  }

  chooseARandomQuestion () {
   const availableNumber = this.availableQuestions.map(tag => tag.questionNumber);
   const randomQuestionNumber = Math.floor(Math.random() * availableNumber.length);
   return this.availableQuestions[randomQuestionNumber].questionNumber;
  }

  subscribeToQuestionSelected () {
    this.subscriptions.push(
      this.quizEventService.onQuestionSelected()
        .subscribe(questionNumber => {
          if (questionNumber !== -1) {
            console.log(` The number of question selected is => ${questionNumber}`);
            // this.navigateToQuiz();
          }
        })
    );
  }

  initiatePage (): void {
    this.pageService.enableSideBarsDisplay(true);
    this.pageService.setPageTitle('Question Selection');
  }
  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy() {
    this.destroyInitPageSettings();
  }

}
