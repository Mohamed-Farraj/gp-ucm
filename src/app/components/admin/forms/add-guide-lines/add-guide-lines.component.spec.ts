import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuideLinesComponent } from './add-guide-lines.component';

describe('AddGuideLinesComponent', () => {
  let component: AddGuideLinesComponent;
  let fixture: ComponentFixture<AddGuideLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGuideLinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGuideLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
