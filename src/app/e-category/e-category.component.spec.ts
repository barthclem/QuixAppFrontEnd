import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECategoryComponent } from './e-category.component';

describe('ECategoryComponent', () => {
  let component: ECategoryComponent;
  let fixture: ComponentFixture<ECategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
