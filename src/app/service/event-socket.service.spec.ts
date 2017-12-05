import { TestBed, inject } from '@angular/core/testing';

import { EventSocketService } from './event-socket.service';

describe('EventSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventSocketService]
    });
  });

  it('should be created', inject([EventSocketService], (service: EventSocketService) => {
    expect(service).toBeTruthy();
  }));
});
