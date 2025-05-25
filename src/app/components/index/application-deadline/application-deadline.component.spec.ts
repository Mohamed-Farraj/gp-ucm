import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDeadlineComponent } from './application-deadline.component';

describe('ApplicationDeadlineComponent', () => {
  let component: ApplicationDeadlineComponent;
  let fixture: ComponentFixture<ApplicationDeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDeadlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
