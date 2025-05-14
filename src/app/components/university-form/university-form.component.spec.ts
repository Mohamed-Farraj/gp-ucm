import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityFormComponent } from './university-form.component';

describe('UniversityFormComponent', () => {
  let component: UniversityFormComponent;
  let fixture: ComponentFixture<UniversityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
