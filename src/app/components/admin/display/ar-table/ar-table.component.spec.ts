import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArTableComponent } from './ar-table.component';

describe('ArTableComponent', () => {
  let component: ArTableComponent;
  let fixture: ComponentFixture<ArTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
