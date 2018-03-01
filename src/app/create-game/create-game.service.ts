import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CreateGameService {

  constructor(private httpClient: HttpClient) { }

  createGame( gameName: string, teamList: string[]) {
    this.httpClient.post('http://localhost:4000', {
      name: gameName,
        teamList: teamList
    })
      .subscribe( res => {
        console.log(`res -- ${JSON.stringify(res)}`);
        return true;
    }, err => {
      console.log(`error -- ${JSON.stringify(err)}`);
      return false;
    });
  }

}
