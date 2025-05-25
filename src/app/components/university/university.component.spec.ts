import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityComponent } from './university.component';

describe('AdduniversityComponent', () => {
  let component: UniversityComponent;
  let fixture: ComponentFixture<UniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
