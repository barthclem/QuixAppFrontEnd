import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../service/time.service';
import {AnimationService} from 'css-animator';
import {Router} from '@angular/router';
import {Unsubscriber} from '../service/Unsubscriber';
import {AnimationBuilder} from 'css-animator';
import {PageService} from '../service/page.service';

@Component({
  selector: 'app-i-start',
  templateUrl: './i-start.component.html',
  styleUrls: ['./i-start.component.css']
})
export class IStartComponent extends Unsubscriber implements OnInit, OnDestroy {

  public  rules = [
    'You have 30 seconds to pick a question',
    'Only one person can pick question for the group',
    'The means of communication in this game is audio'];

  private _animator: AnimationBuilder;

  constructor(
    private pageService: PageService,
    private _elementRef: ElementRef,
    private router: Router,
    animationService: AnimationService,
    private timeService: TimeService
  ) {
    super();
    this._animator = animationService.builder();
    this.subscribeToEndOfStartPage();
  }

  ngOnInit() {
    this.fadeIn('fadeInLeft');
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
    this.timeService.startPageEnd();
  }

  subscribeToEndOfStartPage () {
    this.timeService.onStartPageEnd()
      .subscribe(() => {
          this.fadeOut('fadeOutRight')
            .then(() => {
              this.router.navigate(['timer']);
            })
            .catch(error => {
              console.log(`IStartPage navigate animation error - ${error}`);
            });
        },
        (error) => {
          console.log(`End of Start Page Error => ${error}`);
        });
  }

  initPageSettings () {
    this.pageService.setPageTitle('Instructions and Guide');
  }

  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy(): void {
    this.destroyInitPageSettings();
  }

}
