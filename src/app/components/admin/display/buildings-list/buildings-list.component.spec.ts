import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsListComponent } from './buildings-list.component';

describe('BuildingsListComponent', () => {
  let component: BuildingsListComponent;
  let fixture: ComponentFixture<BuildingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
