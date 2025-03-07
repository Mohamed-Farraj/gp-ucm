import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDisplayComponent } from './ar-display.component';

describe('ArDisplayComponent', () => {
  let component: ArDisplayComponent;
  let fixture: ComponentFixture<ArDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
