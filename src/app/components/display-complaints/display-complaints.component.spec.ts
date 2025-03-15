import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayComplaintsComponent } from './display-complaints.component';

describe('DisplayComplaintsComponent', () => {
  let component: DisplayComplaintsComponent;
  let fixture: ComponentFixture<DisplayComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayComplaintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
