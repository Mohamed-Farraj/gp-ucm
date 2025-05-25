import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPenaltyComponent } from './add-penalty.component';

describe('AddPenaltyComponent', () => {
  let component: AddPenaltyComponent;
  let fixture: ComponentFixture<AddPenaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPenaltyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
