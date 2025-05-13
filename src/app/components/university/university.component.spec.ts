import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdduniversityComponent } from './university.component';

describe('AdduniversityComponent', () => {
  let component: AdduniversityComponent;
  let fixture: ComponentFixture<AdduniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdduniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdduniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
