import { TestBed, async, inject } from '@angular/core/testing';

import { SecurerouteGuard } from './secureroute.guard';

describe('SecurerouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurerouteGuard]
    });
  });

  it('should ...', inject([SecurerouteGuard], (guard: SecurerouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
