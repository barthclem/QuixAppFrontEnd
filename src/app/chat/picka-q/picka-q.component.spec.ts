import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickaQComponent } from './picka-q.component';

describe('PickaQComponent', () => {
  let component: PickaQComponent;
  let fixture: ComponentFixture<PickaQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickaQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickaQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
