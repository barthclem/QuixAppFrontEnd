import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  avatars = new Array(16).fill(0).map((_, i) => `svg-${i+1}`);
  selectedAvatar = this.avatars[0];
  constructor(private dialogRef: MatDialogRef<DialogComponent>) {

  }

  ngOnInit() {
  }

}
