import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSideListComponent } from './users-side-list.component';

describe('UsersSideListComponent', () => {
  let component: UsersSideListComponent;
  let fixture: ComponentFixture<UsersSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSideListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
