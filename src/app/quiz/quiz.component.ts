import { Component, OnInit } from '@angular/core';
import {AnimationService, AnimationBuilder} from 'css-animator';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  private _animator: AnimationBuilder;

  constructor(private animationService: AnimationService) {
    this._animator = animationService.builder();
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


}
