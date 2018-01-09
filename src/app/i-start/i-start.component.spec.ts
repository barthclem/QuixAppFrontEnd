import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IStartComponent } from './i-start.component';

describe('IStartComponent', () => {
  let component: IStartComponent;
  let fixture: ComponentFixture<IStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
