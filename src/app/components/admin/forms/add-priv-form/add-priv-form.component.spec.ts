import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrivFormComponent } from './add-priv-form.component';

describe('AddPrivFormComponent', () => {
  let component: AddPrivFormComponent;
  let fixture: ComponentFixture<AddPrivFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrivFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPrivFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
