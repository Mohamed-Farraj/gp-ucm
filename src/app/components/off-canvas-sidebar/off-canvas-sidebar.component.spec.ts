import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCanvasSidebarComponent } from './off-canvas-sidebar.component';

describe('OffCanvasSidebarComponent', () => {
  let component: OffCanvasSidebarComponent;
  let fixture: ComponentFixture<OffCanvasSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffCanvasSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffCanvasSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
