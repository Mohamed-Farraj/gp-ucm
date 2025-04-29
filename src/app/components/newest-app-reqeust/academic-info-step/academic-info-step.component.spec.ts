import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicInfoStepComponent } from './academic-info-step.component';

describe('AcademicInfoStepComponent', () => {
  let component: AcademicInfoStepComponent;
  let fixture: ComponentFixture<AcademicInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicInfoStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
