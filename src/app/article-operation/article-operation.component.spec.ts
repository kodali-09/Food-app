import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleOperationComponent } from './article-operation.component';

describe('ArticleOperationComponent', () => {
  let component: ArticleOperationComponent;
  let fixture: ComponentFixture<ArticleOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
