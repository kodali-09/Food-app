import { TestBed } from '@angular/core/testing';

import { RecipeOperationService } from './recipe-operation.service';

describe('RecipeOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeOperationService = TestBed.get(RecipeOperationService);
    expect(service).toBeTruthy();
  });
});
