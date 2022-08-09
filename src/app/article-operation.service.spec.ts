import { TestBed } from '@angular/core/testing';

import { ArticleOperationService } from './article-operation.service';

describe('ArticleOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticleOperationService = TestBed.get(ArticleOperationService);
    expect(service).toBeTruthy();
  });
});
