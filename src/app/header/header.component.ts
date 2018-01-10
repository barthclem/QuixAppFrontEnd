import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from "../helpers/userDetails";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit {

  @Input('displayUserInfo') displayUserInfo: boolean;
  @Input('pageTitle') pageTitle: string;
  @Input('userDetails') userDetails: UserInterface;

  constructor() {
  }

  ngOnInit() {
  }

}
