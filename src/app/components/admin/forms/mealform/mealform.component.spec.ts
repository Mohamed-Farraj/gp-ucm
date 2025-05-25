import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealformComponent } from './mealform.component';

describe('MealformComponent', () => {
  let component: MealformComponent;
  let fixture: ComponentFixture<MealformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
