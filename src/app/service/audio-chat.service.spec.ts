import { TestBed, inject } from '@angular/core/testing';

import { AudioChatService } from './audio-chat.service';

describe('AudioChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioChatService]
    });
  });

  it('should be created', inject([AudioChatService], (service: AudioChatService) => {
    expect(service).toBeTruthy();
  }));
});
