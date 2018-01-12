import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimationService, AnimationBuilder} from 'css-animator';
import {PageService} from '../service/page.service';
import {QuestionCardComponent} from './question-card/question-card.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  private _animator: AnimationBuilder;

  constructor(
    private pageService: PageService,
    private animationService: AnimationService,
    private _elementRef: ElementRef,
  private router: Router) {
    this._animator = animationService.builder();
    this.initiatePage();
  }

  ngOnInit() {
    const loadingElem = document.getElementById('app-loading');

    console.log(`Loading Element : ${loadingElem}`);
    const spinningElem = loadingElem.querySelector('.loader');

    this._animator
      .setDuration(300)
      .setType('fadeOut')
      .hide(loadingElem)
      .then(() => {
        spinningElem.classList.remove('running');
      })
      .catch(error => { console.log(` Quiz Page Error : ${error}`); });

  }

  fadeOut() {
    this._animator
      .setType('fadeOutLeft')
      .setDelay(100)
      .setDuration(700)
      .hide(this._elementRef.nativeElement)
      .then(() => {
        this.router.navigate(['e-category']); })
      .catch( error => { console.log(`fade In - Error using Animation => ${error}`); });

  }

  initiatePage (): void {
    this.pageService.isQuixMainApp(true);
    this.pageService.enableSideBarsDisplay(true);
    this.pageService.setPageTitle('Live Competition');
  }

  navigate($event): void {
    console.log('\n\nQX: Received Message from Child Component ... (-_-)\n\n');
    this.fadeOut();
  }

  destroyInitPageSettings (): void {
    this.pageService.destroyPageView();
  }

  ngOnDestroy() {
    this.destroyInitPageSettings();
}

}
