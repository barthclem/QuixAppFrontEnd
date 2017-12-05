import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fresh-dialog',
  templateUrl: './fresh-dialog.component.html',
  styleUrls: ['./fresh-dialog.component.css']
})
export class FreshDialogComponent implements OnInit {

  public username: string;
  public team: string;
  constructor(private dialogRef: MatDialogRef<FreshDialogComponent>) { }

  ngOnInit() {
  }

}
