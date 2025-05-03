import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAssignRoomsComponent } from './upload-assign-rooms.component';

describe('UploadAssignRoomsComponent', () => {
  let component: UploadAssignRoomsComponent;
  let fixture: ComponentFixture<UploadAssignRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAssignRoomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadAssignRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
