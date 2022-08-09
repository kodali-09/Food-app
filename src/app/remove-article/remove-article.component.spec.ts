import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveArticleComponent } from './remove-article.component';

describe('RemoveArticleComponent', () => {
  let component: RemoveArticleComponent;
  let fixture: ComponentFixture<RemoveArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
