import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyInfoStepComponent } from './family-info-step.component';

describe('FamilyInfoStepComponent', () => {
  let component: FamilyInfoStepComponent;
  let fixture: ComponentFixture<FamilyInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyInfoStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
