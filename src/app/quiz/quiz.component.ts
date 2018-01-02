import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnimationService, AnimationBuilder} from 'css-animator';
import {PageService} from '../service/page.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  private _animator: AnimationBuilder;

  constructor(
    private pageService: PageService,
    private animationService: AnimationService) {
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

  initiatePage (): void {
    this.pageService.isQuixMainApp(true);
    this.pageService.enableSideBarsDisplay(true);
    this.pageService.setPageTitle('Live Competition');
  }
  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy() {
    this.destroyInitPageSettings();
}

}
