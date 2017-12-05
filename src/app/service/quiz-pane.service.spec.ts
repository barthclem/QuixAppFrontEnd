import { TestBed, inject } from '@angular/core/testing';

import { QuizEventService } from './quiz-pane.service';

describe('QuizEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizEventService]
    });
  });

  it('should be created', inject([QuizEventService], (service: QuizEventService) => {
    expect(service).toBeTruthy();
  }));
});
