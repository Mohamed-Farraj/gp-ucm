import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCardComponent } from './log-card.component';

describe('LogCardComponent', () => {
  let component: LogCardComponent;
  let fixture: ComponentFixture<LogCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
