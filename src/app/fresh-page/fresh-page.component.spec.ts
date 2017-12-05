import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshPageComponent } from './fresh-page.component';

describe('FreshPageComponent', () => {
  let component: FreshPageComponent;
  let fixture: ComponentFixture<FreshPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
