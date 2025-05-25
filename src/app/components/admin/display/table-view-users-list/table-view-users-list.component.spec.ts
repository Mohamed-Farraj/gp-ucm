import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewUsersListComponent } from './table-view-users-list.component';

describe('TableViewUsersListComponent', () => {
  let component: TableViewUsersListComponent;
  let fixture: ComponentFixture<TableViewUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableViewUsersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableViewUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
