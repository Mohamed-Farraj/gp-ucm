import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlinsFormComponent } from './deadlins-form.component';

describe('DeadlinsFormComponent', () => {
  let component: DeadlinsFormComponent;
  let fixture: ComponentFixture<DeadlinsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadlinsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeadlinsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
