import { TestBed, inject } from '@angular/core/testing';

import { QChooserService } from './q-chooser.service';

describe('QChooserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QChooserService]
    });
  });

  it('should be created', inject([QChooserService], (service: QChooserService) => {
    expect(service).toBeTruthy();
  }));
});
