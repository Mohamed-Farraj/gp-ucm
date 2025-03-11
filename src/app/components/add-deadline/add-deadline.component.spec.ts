import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeadlineComponent } from './add-deadline.component';

describe('AddDeadlineComponent', () => {
  let component: AddDeadlineComponent;
  let fixture: ComponentFixture<AddDeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeadlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
