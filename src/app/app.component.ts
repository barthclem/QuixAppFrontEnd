import {Component} from '@angular/core';
import {MatIconRegistry, MatDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogComponent} from './dialog/dialog.component';

import 'rxjs/add/operator/filter';
import {PageService} from './service/page.service';
import {Unsubscriber} from './service/Unsubscriber';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends Unsubscriber {
  pageTitle: Observable<string>;
  displayTeamMembers: Observable<boolean>;
  displayTeamsScore: Observable<boolean>;
  displaySBars: Observable<boolean>;
  displayQuixMainApp: Observable<boolean>;
  displayUserInfo = false;
  userDetails: any;

  constructor(private pageService: PageService) {
    super();
    this.subscribeToUserInfoUpdate();
    this.pageTitle = this.pageService.pageTitle;
    this.displayTeamMembers = this.pageService.displayTeamMembers;
    this.displayTeamsScore = this.pageService.displayTeamScore;
    this.displaySBars = this.pageService.displaySideBars;
    this.displayQuixMainApp = this.pageService.quixMainApp;
  }

  subscribeToUserInfoUpdate() {
    this.subscriptions.push(this.pageService.displayUserInfo
      .subscribe(infoUpdate => {
        this.displayUserInfo = infoUpdate;
      }));
  }


}

