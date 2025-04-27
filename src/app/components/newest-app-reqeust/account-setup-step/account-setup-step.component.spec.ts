import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSetupStepComponent } from './account-setup-step.component';

describe('AccountSetupStepComponent', () => {
  let component: AccountSetupStepComponent;
  let fixture: ComponentFixture<AccountSetupStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSetupStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSetupStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
