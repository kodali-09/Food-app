import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeOperationComponent } from './recipe-operation.component';

describe('RecipeOperationComponent', () => {
  let component: RecipeOperationComponent;
  let fixture: ComponentFixture<RecipeOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
