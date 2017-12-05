import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoserComponent } from './choser.component';

describe('ChoserComponent', () => {
  let component: ChoserComponent;
  let fixture: ComponentFixture<ChoserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
