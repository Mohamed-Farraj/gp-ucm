import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAppealsComponent } from './display-appeals.component';

describe('DisplayAppealsComponent', () => {
  let component: DisplayAppealsComponent;
  let fixture: ComponentFixture<DisplayAppealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayAppealsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayAppealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
