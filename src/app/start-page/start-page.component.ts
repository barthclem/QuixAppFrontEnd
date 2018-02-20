import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from '../service/quiz.service';
import {QuizEventService} from '../service/quiz-pane.service';
import {AnimationBuilder, AnimationService} from 'css-animator';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../service/page.service';
import {EventSocketService} from '../service/event-socket.service';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit, OnDestroy {

  username: string;
  teamName: string;
  teamList: string[];
  gameName: string;
  regSuccess: boolean;

  private _animator: AnimationBuilder;

  constructor(
                private eventService: EventSocketService,
                private pageService: PageService,
                private _elementRef: ElementRef,
               private router: Router,
               private route: ActivatedRoute,
               animationService: AnimationService,
               private quizEvents: QuizEventService,
               private quizService: QuizService,
                private httpClient: HttpClient
  ) {
    this._animator = animationService.builder();
    this.gameName = this.route.snapshot.params.gameName;
    this.initPageSettings();
    this.regSuccess = true;
  }


  ngOnInit() {
    this.initData(this.gameName);
    this.fadeIn('fadeInUp');
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

  logIn() {

    this.httpClient.post(`${environment.api_url_secure}/${this.gameName}`, {
      user: this.username,
      team: this.teamName
    })
      .subscribe( async (res: any) => {
        console.log(`Reg res -- ${JSON.stringify(res)}`);
        if ( res.success) {
          await this.eventService.subscribeToAllEvent(res.data.gamePort);
          this.initStartPage();
        } else {
          this.regSuccess = false;
        }
      }, err => {
        console.log(`error -- ${JSON.stringify(err)}`);

      });
    }

    initStartPage() {
      this.quizService.teamName = this.teamName;
      this.quizService.username = this.username;
      this.quizEvents.userDetailsTaken({
        username: this.username,
        team: this.teamName
      });
      this.pageService.initUserDetails(this.username, this.teamName);
      console.log(`START Quix Service - team: ${this.teamName}   - username: ${this.username}`);
      this.fadeOut('fadeOutDown')
        .then(() => {
          this.router.navigate(['istart']);
        })
        .catch(error => {
          console.log(`StartPage Error Nav Error - ${error}`);
        });

    }
  initData ( pathName: string) {
    console.log(`\n\n\n INit Data -- \n\n\n`);
    this.httpClient.get(`${environment.api_url_secure}/${pathName}`)
      .subscribe((res: any) => {
      this.teamList = res.data.teamList.map(iTeam => iTeam.teamName);
       alert(`Team List => ${JSON.stringify(this.teamList)}`);
        console.log(`\n\n\n Team List => ${JSON.stringify(res.data)}`);
        }, err => {
        console.log(`\n\n\n Start Page Init Error => ${JSON.stringify(err)}`);
      });
  }

  initPageSettings () {
    this.pageService.setPageTitle('Start');
  }

  destroyInitPageSettings () {
    this.pageService.destroyPageView();
  }

  ngOnDestroy(): void {
  this.destroyInitPageSettings();
  }

}
