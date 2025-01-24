import { TestBed } from '@angular/core/testing';

import { MasterDataFilterService } from './master-data-filter.service';

describe('MasterDataFilterService', () => {
  let service: MasterDataFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterDataFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
