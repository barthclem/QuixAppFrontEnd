import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshDialogComponent } from './fresh-dialog.component';

describe('FreshDialogComponent', () => {
  let component: FreshDialogComponent;
  let fixture: ComponentFixture<FreshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
