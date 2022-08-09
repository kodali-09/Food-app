import { TestBed } from '@angular/core/testing';

import { RecentActionsService } from './recent-actions.service';

describe('RecentActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentActionsService = TestBed.get(RecentActionsService);
    expect(service).toBeTruthy();
  });
});
