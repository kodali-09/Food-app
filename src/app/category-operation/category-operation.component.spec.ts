import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryOperationComponent } from './category-operation.component';

describe('CategoryOperationComponent', () => {
  let component: CategoryOperationComponent;
  let fixture: ComponentFixture<CategoryOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
