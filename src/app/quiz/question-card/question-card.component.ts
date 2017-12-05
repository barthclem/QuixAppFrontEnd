import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TimeService} from '../../service/time.service';
import {QuizEventService} from '../../service/quiz-pane.service';
import {QuizService} from '../../service/quiz.service';
import {Question} from '../../helpers/question';
import {Unsubscriber} from '../../service/Unsubscriber';
import {TimerInterface} from '../../helpers/timeInterface';
import {AnimationService} from 'css-animator';
import {AnimationBuilder} from 'css-animator';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css']
})
export class QuestionCardComponent extends Unsubscriber implements OnInit {


  private _markedAnswer = -1;
  private answerPicked = new BehaviorSubject(false);
  public question: Question;
  public time: TimerInterface;
  private timeSubscription: Subscription;
  public teamTurn: boolean;
  public teamBonus: boolean;
  public questionSession: boolean;
  public bonusSession: boolean;
  private timeToAnswer: number;
  public selectedOptionIndex = -1;

  private _animator: AnimationBuilder;
  constructor(
    private animationService: AnimationService, private _elementRef: ElementRef,
    private router: Router, private timeService: TimeService,
    private quizEventService: QuizEventService, private quizService: QuizService ) {
    super();
    this.subscribeQuestionOptionPicked();
    this.subscribeToStartBonus();
    this.subscribeToAnswerLoaded();
    this.subscribeToGoToPickQuestion();
    this.subscribeToEndCategory();
    this._animator = animationService.builder();
    this.time = this.timeService.getTimer();
    this.teamTurn = this.quizService.teamTurn;
    this.question = this.quizService.currentQuestion;
    this.questionSession = true;
    this.startQuestionCountDownTimer();
    this.quizService.setMessage('It is your turn to pick a question');
}

  ngOnInit() {
    this.fadeInAnimation();
  }

  fadeInAnimation () {
    this._animator
      .setType('fadeInRight')
      .setDelay(100)
      .setDuration(700)
      .show(this._elementRef.nativeElement)
      .then(() => { console.log('Page is loaded'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }

  startTimer( min: number, sec: number) {
    this.timeToAnswer = 0;
    this.timeSubscription = this.timeService.countdownTimer(min, sec, this.answerPicked)
      .subscribe((time) => {
          this.time.minutes = this.timeService.getMinute(time);
          this.time.seconds = this.timeService.getSeconds(time);
          this.timeToAnswer++;
        }, (error) => {console.log(` Choser Timer Error => ${error} `); },
        () => {
          if (!this.answerPicked.getValue()) {
            this.timeService.onTimeForQuestionExpired();
            this.fadeOut();
          }
        });
  }


  startQuestionCountDownTimer() {
    this.startTimer(1, 30);
  }

  startBonusCountDownTimer() {
    this.startTimer(0, 45);
  }

  fadeOut() {
    this._animator
      .setType('fadeOutLeft')
      .setDelay(1000)
      .setDuration(1000)
      .hide(this._elementRef.nativeElement)
      .then(() => { console.log('Page is loaded'); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }


  public answerClicked(index: number, checked: boolean) {
    console.log(`current value of answer picked => ${this.answerPicked.getValue()}`);
    this.answerPicked.next(true);
    console.log(`updated value of answer picked => ${this.answerPicked.getValue()}`);
    console.log(` An Option is marked `);
    this._markedAnswer = index;
    const attemptedAnswer = {
      selectedOption: this.question.options[index],
      timeToAnswer: this.timeToAnswer,
      selectedOptionIndex: index
    };
    console.log(` Your answer is => ${JSON.stringify(attemptedAnswer)}`);
    this.stopTimer();
    if (this.teamTurn) {
      this.quizEventService.questionAnswered(attemptedAnswer);
    } else {
      this.quizEventService.bonusAttempted(attemptedAnswer);
    }
  }

  stopTimer() {
    this.timeSubscription.unsubscribe();
  }

  subscribeToAnswerLoaded () {
    this.subscriptions.push(this.quizEventService.onAnsweredLoaded()
      .subscribe(answerBlock => {
        console.log(`Answer Loaded itch => ${JSON.stringify(answerBlock)}`);
        const message = `Team ${answerBlock.teamName} chose ${answerBlock.selectedOption}`;
        this.answerPicked.next(false);
        this.selectedOptionIndex = answerBlock.selectedOptionIndex;
        this.answerPicked.next(true);
        this.setNotificationMessage(message);
        setTimeout(() => {
          if (this.teamTurn) {
            this.setNotificationMessage(`You are ${answerBlock.isCorrect ? 'correct' : 'wrong'}`);
          } else {
            this.setNotificationMessage(`Team ${answerBlock.teamName} is ${answerBlock.isCorrect ? 'correct' : 'wrong'}`);
          }
        }, 2000);
        this.teamTurn = false;
      }));
  }

  subscribeQuestionOptionPicked() {
    this.subscriptions.push(this.quizEventService.onQuestionAnswered()
      .subscribe(questionOption => {
        // this.checkAnswer(questionOption);
      }));
  }

  subscribeToStartBonus() {
    this.subscriptions.push(
      this.quizEventService.onBonusLoaded().subscribe((teamName) => {
        this.questionSession = false;
        this.bonusSession = true;
        this.teamBonus = teamName === this.quizService.teamName;
        const message = ` Wrong!, Bonus goes to team ${teamName}`;
        console.log(message);
        this.setNotificationMessage(message);
        if (this.teamBonus) {
          this.setNotificationMessage(`Team ${teamName} You have a bonus question`);
        }
        this.startBonusSession(); })
    );
  }

  startBonusSession () {
    this.selectedOptionIndex = -1;
    this.answerPicked.next(false);
    this._markedAnswer = -1;
    this.startBonusCountDownTimer();
    console.log(`Start the bonus counter and countdown`);
  }

  goToPickQuestion() {
    console.log('start countdown timer');
    Observable.timer(3000)
      .finally(() => {
      console.log(`Countdown Started`);
      this.fadeOut();
      this.router.navigate(['choose']); })
      .subscribe();
  }

  subscribeToGoToPickQuestion () {
    console.log(`Considered Users Turn Subscribe`);
    this.subscriptions.push(
      this.quizEventService.onUsersTurnToPickQuestion()
        .subscribe(queTag => {
          console.log(`QueTag => ${JSON.stringify(queTag)}`);
          if (queTag.team && this.quizService.teamName) {
            this.quizService.activeTeam = queTag.team;
            this.quizService.teamTurn = this.quizService.teamName === queTag.team;
            this.goToPickQuestion();
          }
        })
    );
  }

  subscribeToEndCategory () {
    this.subscriptions.push(
      this.quizEventService.onEndOfCategory()
        .subscribe(() => {
          this.fadeOut();
          this.router.navigate(['category']);
        })
    );
  }

  setNotificationMessage( message: string) {
    this.quizService.setMessage(message);
  }

}
