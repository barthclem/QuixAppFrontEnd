import { TestBed, inject } from '@angular/core/testing';

import { QuizResultService } from './quiz-result.service';

describe('QuizResultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizResultService]
    });
  });

  it('should be created', inject([QuizResultService], (service: QuizResultService) => {
    expect(service).toBeTruthy();
  }));
});
