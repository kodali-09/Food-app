import { TestBed } from '@angular/core/testing';

import { CategoryOperationService } from './category-operation.service';

describe('CategoryOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryOperationService = TestBed.get(CategoryOperationService);
    expect(service).toBeTruthy();
  });
});
