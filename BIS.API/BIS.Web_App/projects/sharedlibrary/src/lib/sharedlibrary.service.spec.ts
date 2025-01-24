import { TestBed } from '@angular/core/testing';

import { SharedlibraryService } from './sharedlibrary.service';

describe('SharedlibraryService', () => {
  let service: SharedlibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedlibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
