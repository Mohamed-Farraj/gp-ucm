import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceStatusComponent } from './acceptance-status.component';

describe('AcceptanceStatusComponent', () => {
  let component: AcceptanceStatusComponent;
  let fixture: ComponentFixture<AcceptanceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptanceStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
