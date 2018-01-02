import {
  AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding,
  OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {TimeService} from '../service/time.service';
import {MatDialog} from '@angular/material';
import {FreshDialogComponent} from './fresh-dialog/fresh-dialog.component';
import {QuizEventService} from '../service/quiz-pane.service';
import {EventSocketService} from '../service/event-socket.service';
import {QuizService} from "../service/quiz.service";

@Component({
  selector: 'app-fresh-page',
  templateUrl: './fresh-page.component.html',
  styleUrls: ['./fresh-page.component.css']
})
@HostBinding('hidden')
export class FreshPageComponent implements OnInit, AfterViewInit, AfterViewChecked {

  private _animator: AnimationBuilder;
  private  rules = [
      '1.  You have 30 seconds to pick a question',
    '2.  You have one minute to answer a question',
    '3. The only means of collaboration is the inbuilt chat system',
    '4. Only one person can answer a question in a team'];

    proceedToRules = false;
  constructor(
    private _elementRef: ElementRef,
    private router: Router,
    animationService: AnimationService,
    private timeService: TimeService,
    private quizEvents: QuizEventService,
    private quizService: QuizService,
    private dialog: MatDialog) {
    this._animator = animationService.builder();
    this.subscribeToEndOfStartPage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openDialog();
    }, 10);

  }

  ngAfterViewChecked(): void {

  }

  ngOnInit() {

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



  startQuiz() {

    if (!this.proceedToRules) {
      this.fadeOut('fadeOutLeft');
      this.fadeIn('fadeInRight');
      this.proceedToRules = true;
      return;
    }

    this.fadeOut('fadeOutDown')
      .then(() => {
      console.log('move this thing');
      });
      this.timeService.startPageEnd();
    console.log('move this thing');
  }

  subscribeToEndOfStartPage () {
    this.timeService.onStartPageEnd()
      .subscribe(() => {
        this.router.navigate(['timer']);
      },
        (error) => {
         console.log(`End of Start Page Error => ${error}`);
        });
  }

  openDialog() {
    this.dialog.open(FreshDialogComponent)
      .afterClosed()
      .subscribe(userDetails => {
        this.quizService.teamName = userDetails.team;
        this.quizService.username = userDetails.username;
        this.quizEvents.userDetailsTaken(userDetails);
      });
  }
}
