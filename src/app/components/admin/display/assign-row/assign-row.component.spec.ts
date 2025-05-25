import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRowComponent } from './assign-row.component';

describe('AssignRowComponent', () => {
  let component: AssignRowComponent;
  let fixture: ComponentFixture<AssignRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
